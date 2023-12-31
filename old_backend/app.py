from functions import *
from flask import Flask, jsonify, make_response, render_template, request
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)

# POST routes

@app.route('/add-hint', methods=['POST'])
@cross_origin()
def addHint():
    print('adding hint...')
    game = request.json['game']
    hint = request.json['hint']
    add_hint(game, hint)
    return jsonify({'success': 'ok'})

# GET routes

@app.route('/get-hint/id=<id>', methods=['GET'])
@cross_origin()
def getHint(id):
    print('getting hint...')
    hint = get_hint(id)
    if hint:
        return jsonify(hint)
    else:
        # return 404 response
        return jsonify({'error': '404'})

@app.route('/all-hints')
def getHints():
    hints = get_hints()
    return jsonify([doc for doc in hints])

## still need to update this route

@app.route('/id=<id>') # I'm saving data about what hints the user has viewed. I should create a separate item for every hint that's been found.
def showHint(id):
    found_hint = hint_found(id, request.cookies.get('user_id'))

    if found_hint:
        resp = make_response(render_template('hint_page.html', hint=found_hint['hint'], totalHints=get_hint_count(found_hint['game']), foundHints=get_found_hints(found_hint['game'], found_hint['user'])))
    
        # add the cookie to the response if nessesary
        if found_hint['cookie']:
            resp.set_cookie('userID', found_hint['cookie'])
        
            # return the hint page
            return resp
    else:
        # return 404 page
        return render_template('404.html')

if __name__ == '__main__':
    app.run(debug=True)