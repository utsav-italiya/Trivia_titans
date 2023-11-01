import functions_framework
from flask import request, jsonify
from firebase_admin import credentials, firestore, initialize_app

# Load the Firebase credentials
cred = credentials.Certificate('serviceAccountKey.json')

# Initialize the Firebase app
default_app = initialize_app(cred)

# Get a reference to the Firestore service
db = firestore.client()

@functions_framework.http
def update_team_score(request):
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }
        return ('', 204, headers)

    request_json = request.get_json(silent=True)

    if request_json and 'team_name' in request_json and 'game_id' in request_json:
        team_name = request_json['team_name']
        game_id = request_json['game_id']

        # Fetch all users from the userstats table with that team_id
        userstats_ref = db.collection(u'userstats')
        query_ref = userstats_ref.where(u'team_name', u'==', team_name)

        users = query_ref.stream()

        total_score = 0
        user_count = 0

        for user in users:
            user_data = user.to_dict()
            total_score += user_data.get('score', 0)
            user_count += 1

        if user_count == 0:
            response = {'success': False, 'message': 'No users found for the given game_id'}
            return jsonify(response), 404, {'Access-Control-Allow-Origin': '*'}

        average_score = total_score / user_count

        # Create a reference to the teamstats collection
        teamstats_ref = db.collection(u'teamstats')
        query_ref = teamstats_ref.where(u'team_name', u'==', team_name).where(u'game_id', u'==', game_id)

        # Get a list of all matching documents
        teams = query_ref.stream()

        if teams:
            # Update the score for the found item
            for team in teams:
                team.reference.update({'score': average_score})

            response = {'success': True, 'message': 'Team Score successfully updated'}
            status_code = 200
        else:
            response = {'success': False, 'message': 'Team Not Found'}
            status_code = 404

        headers = {'Access-Control-Allow-Origin': '*'}

        return jsonify(response), status_code, headers

    else:
        response = {'success': False, 'message': 'Invalid request: Missing team_name or game_id'}
        headers = {'Access-Control-Allow-Origin': '*'}
        return jsonify(response), 400, headers
