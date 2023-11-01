import csv
from io import StringIO
import functions_framework
from flask import make_response, jsonify
from firebase_admin import credentials, firestore, initialize_app
from google.cloud import storage

# Load the Firebase credentials
cred = credentials.Certificate('serviceAccountKey.json')

# Initialize the Firebase app
default_app = initialize_app(cred)

# Get a reference to the Firestore service
db = firestore.client()

# Create a storage client
storage_client = storage.Client()

@functions_framework.http
def export_leaderboard(request):
    # Set CORS headers for preflight requests
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }
        return ('', 204, headers)

    bucket_name = 'leaderboard-csv'

    # Create the bucket if it doesn't exist
    bucket = storage_client.bucket(bucket_name)
    if not bucket.exists():
        bucket = storage_client.create_bucket(bucket_name)

    # Function to write CSV from Firestore collection
# Function to write CSV from Firestore collection
    def write_csv_to_bucket(output, fields, collection_name, file_name):
        writer = csv.writer(output)
        writer.writerow(fields)
        ref = db.collection(collection_name)
        docs = ref.stream()
        for doc in docs:
            writer.writerow([doc._data.get(field, 'N/A') for field in fields])  # 'N/A' will be used if the field is missing
        blob = bucket.blob(file_name)
        blob.upload_from_string(output.getvalue(), content_type='text/csv')
        blob.make_public()

    # Write 'userstats' to CSV
    user_output = StringIO()
    user_fields = ['draw', 'game_id', 'loss', 'score', 'team_name', 'user_id', 'win']
    write_csv_to_bucket(user_output, user_fields, u'userstats', 'userstats.csv')

    # Write 'teamstats' to CSV
    team_output = StringIO()
    team_fields = ['draw', 'game_id', 'loss', 'score', 'team_name', 'win']
    write_csv_to_bucket(team_output, team_fields, u'teamstats', 'teamstats.csv')

    response = {
        'success': True,
        'message': f'Data exported successfully to {bucket_name} for userstats.csv and teamstats.csv'
    }

    headers = {'Access-Control-Allow-Origin': '*'}

    return make_response(jsonify(response), 200, headers)
