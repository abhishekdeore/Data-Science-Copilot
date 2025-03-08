from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import os
import json
import numpy as np

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests for development

UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route('/upload', methods=['POST'])
def upload_file():
    try:
        print("Received upload request")
        if 'file' not in request.files:
            print("No file part in request")
            return jsonify({'error': 'No file part'}), 400
        
        file = request.files['file']
        if file.filename == '':
            print("No selected file")
            return jsonify({'error': 'No selected file'}), 400
        
        print(f"File received: {file.filename}")
        
        if file and file.filename.endswith('.csv'):
            try:
                filepath = os.path.join(UPLOAD_FOLDER, file.filename)
                print(f"Saving file to: {filepath}")
                file.save(filepath)
                
                # Read and return basic statistics
                print("Reading CSV file...")
                df = pd.read_csv(filepath)
                print(f"CSV loaded, shape: {df.shape}")
                
                # Convert NumPy types to native Python types
                missing_values = df.isna().sum().to_dict()
                missing_values = {k: int(v) for k, v in missing_values.items()}
                
                stats = {
                    'rows': int(len(df)),
                    'columns': int(len(df.columns)),
                    'column_names': df.columns.tolist(),
                    'missing_values': missing_values,
                    'duplicate_rows': int(df.duplicated().sum())
                }
                
                print("Stats calculated successfully")
                return jsonify({
                    'success': True,
                    'filename': file.filename,
                    'stats': stats
                })
            except Exception as e:
                import traceback
                print(f"Error processing CSV: {str(e)}")
                print(traceback.format_exc())
                return jsonify({'error': f'Error processing CSV: {str(e)}'}), 500
        
        print("File must be CSV")
        return jsonify({'error': 'File must be CSV'}), 400
    except Exception as e:
        import traceback
        print(f"Unexpected error: {str(e)}")
        print(traceback.format_exc())
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@app.route('/data/<filename>', methods=['GET'])
def get_data(filename):
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    if not os.path.exists(filepath):
        return jsonify({'error': 'File not found'}), 404
    
    try:
        df = pd.read_csv(filepath)
        # Convert to records and handle NaN values
        records = df.head(100).to_dict(orient='records')
        
        # Handle NumPy and NaN values for JSON serialization
        for row in records:
            for key, value in row.items():
                if pd.isna(value):
                    row[key] = None
                elif isinstance(value, np.integer):
                    row[key] = int(value)
                elif isinstance(value, np.floating):
                    row[key] = float(value)
                elif isinstance(value, np.ndarray):
                    row[key] = value.tolist()
        
        return jsonify({
            'data': records,
            'total_rows': int(len(df))
        })
    except Exception as e:
        import traceback
        print(f"Error reading file: {str(e)}")
        print(traceback.format_exc())
        return jsonify({'error': f'Error reading file: {str(e)}'}), 500

@app.route('/upload-stats/<filename>', methods=['GET'])
def get_upload_stats(filename):
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    if not os.path.exists(filepath):
        return jsonify({'error': 'File not found'}), 404
    
    try:
        df = pd.read_csv(filepath)
        
        # Convert NumPy types to native Python types
        missing_values = df.isna().sum().to_dict()
        missing_values = {k: int(v) for k, v in missing_values.items()}
        
        stats = {
            'rows': int(len(df)),
            'columns': int(len(df.columns)),
            'column_names': df.columns.tolist(),
            'missing_values': missing_values,
            'duplicate_rows': int(df.duplicated().sum())
        }
        
        return jsonify({
            'success': True,
            'filename': filename,
            'stats': stats
        })
    except Exception as e:
        import traceback
        print(f"Error processing CSV stats: {str(e)}")
        print(traceback.format_exc())
        return jsonify({'error': f'Error processing CSV: {str(e)}'}), 500

@app.route('/clean', methods=['POST'])
def clean_data():
    data = request.json
    filename = data.get('filename')
    operations = data.get('operations', {})
    
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    if not os.path.exists(filepath):
        return jsonify({'error': 'File not found'}), 404
    
    try:
        # Read the CSV with proper handling for missing values
        df = pd.read_csv(filepath, na_values=['NA', 'N/A', 'na', 'n/a', '', ' ', 'null', 'NULL', 'none', 'None', '?'])
        original_rows = len(df)
        original_cols = len(df.columns)
        
        # Apply cleaning operations
        if operations.get('drop_duplicates', False):
            df = df.drop_duplicates()
        
        # Handle missing values with custom rules
        missing_value_ops = operations.get('missing_value_operations', [])
        for rule in missing_value_ops:
            column = rule.get('column')
            missing_type = rule.get('missingType')
            action = rule.get('action')
            replacement = rule.get('replacement')
            
            if column not in df.columns:
                continue
                
            # Create mask for the specific missing value type
            mask = None
            if missing_type == 'null':
                mask = df[column].isnull()
            elif missing_type == 'nan':
                mask = pd.isna(df[column])
            elif missing_type == 'empty':
                mask = df[column].astype(str) == ''
            elif missing_type == 'na':
                mask = df[column].astype(str).isin(['NA', 'N/A', 'na', 'n/a'])
            elif missing_type == 'custom' and replacement is not None:
                mask = df[column].astype(str) == replacement
            
            if mask is None:
                continue
                
            # Apply the action
            if action == 'drop':
                df = df[~mask]
            elif action == 'replace' and replacement is not None:
                df.loc[mask, column] = replacement
            elif action == 'mean' and pd.api.types.is_numeric_dtype(df[column]):
                mean_val = df[column].mean(skipna=True)
                df.loc[mask, column] = mean_val
            elif action == 'median' and pd.api.types.is_numeric_dtype(df[column]):
                median_val = df[column].median(skipna=True)
                df.loc[mask, column] = median_val
            elif action == 'mode':
                mode_vals = df[column].mode()
                if not mode_vals.empty:
                    df.loc[mask, column] = mode_vals[0]
        
        # Drop columns if specified
        columns_to_drop = operations.get('drop_columns', [])
        if columns_to_drop:
            df = df.drop(columns=columns_to_drop, errors='ignore')
        
        # Save cleaned file
        cleaned_filename = f"cleaned_{filename}"
        cleaned_filepath = os.path.join(UPLOAD_FOLDER, cleaned_filename)
        df.to_csv(cleaned_filepath, index=False)
        
        return jsonify({
            'success': True,
            'original_filename': filename,
            'cleaned_filename': cleaned_filename,
            'original_rows': original_rows,
            'cleaned_rows': len(df),
            'rows_removed': original_rows - len(df),
            'original_columns': original_cols,
            'cleaned_columns': len(df.columns),
            'columns_removed': original_cols - len(df.columns)
        })
    except Exception as e:
        import traceback
        print(f"Error cleaning data: {str(e)}")
        print(traceback.format_exc())
        return jsonify({'error': f'Error cleaning data: {str(e)}'}), 500
    
    
@app.route('/data-view/<filename>', methods=['GET'])
def get_data_view(filename):
    view_type = request.args.get('type', 'head')  # Default to head
    n_rows = int(request.args.get('n', 10))  # Default to 10 rows
    start_row = int(request.args.get('start', 0))  # Default start row
    
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    if not os.path.exists(filepath):
        return jsonify({'error': 'File not found'}), 404
    
    try:
        df = pd.read_csv(filepath)
        result = None
        
        if view_type == 'head':
            result = df.head(n_rows)
        elif view_type == 'tail':
            result = df.tail(n_rows)
        elif view_type == 'range':
            end_row = min(start_row + n_rows, len(df))
            result = df.iloc[start_row:end_row]
        else:
            return jsonify({'error': 'Invalid view type. Use head, tail, or range.'}), 400
        
        # Convert to records and handle NaN values
        records = result.to_dict(orient='records')
        
        # Handle NumPy and NaN values for JSON serialization
        for row in records:
            for key, value in row.items():
                if pd.isna(value):
                    row[key] = None
                elif isinstance(value, np.integer):
                    row[key] = int(value)
                elif isinstance(value, np.floating):
                    row[key] = float(value)
                elif isinstance(value, np.ndarray):
                    row[key] = value.tolist()
        
        return jsonify({
            'data': records,
            'total_rows': int(len(df)),
            'view_type': view_type,
            'rows_returned': len(records)
        })
    except Exception as e:
        import traceback
        print(f"Error creating data view: {str(e)}")
        print(traceback.format_exc())
        return jsonify({'error': f'Error creating data view: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))