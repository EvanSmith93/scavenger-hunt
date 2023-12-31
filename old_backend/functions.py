from strgen import StringGenerator as SG
import pymongo
import certifi

# get the information from the database
client = pymongo.MongoClient('mongodb+srv://evan-smith993:88qiXhde7YFNoQTV@evan-smith.qlz3vpe.mongodb.net/?retryWrites=true&w=majority', tlsCAFile=certifi.where())
db = client['scavenger_database']
games = db['games']
hints = db['hints']
users = db['users']

# generate the user id that is stored as a cookie
def cookie_id():
    return SG(r"[\w]{30}").render()

# generate the id for each hint
def generate_id():
    return SG(r"[\w]{10}").render()

# get the total number of hints from a game
def get_hint_count(game):
    return len(get_hints(game))

# get the number of found hints in a game from a user
def get_found_hints(game, user):
    #return len([ 0 for hint in user['found-hints'] if hint['game'] == game ])
    # Get the found hint IDs for the user
    found_hint_ids = users.find_one({'User': user})['Found-hints']

    # Find the hints for the game with the matching IDs
    found_hints = hints.find({
        '_id': game,
        'Hint': {'$in': found_hint_ids}
    })

    return len(found_hints)

# get the hint from the id
def get_hint(id):
    return hints.find_one({ '_id': id })

# get all the hints in a game or all the hints
def get_hints(game=None):
    # get all the hints in the game
    if game:
        return hints.find({ 'game': game })
    else:
        return hints.find()

# add a new hint to a game
def add_hint(game, hint):
    print("adding hint function call")

    # generate hint id
    id = generate_id()

    # insert the new hint object
    hints.replace_one({ '_id': id }, { '_id': id, 'game': game, 'hint': hint }, upsert=True)

    # update / add the new game with the new hint id
    games.update_one({ 'name': game }, { '$addToSet': { 'hints': id } }, upsert=True)

def hint_found(id, user_id):
    # get the hint from the id
    hint_from_id = hints.find_one({ '_id': id })

    # if the id was found
    if hint_from_id != None:
        cookie = None
        game = hint_from_id['game']

        # get the current user
        user = users.find_one({ '_id': user_id })

        # if the user doesn't exist, set up a new user
        if user == None:
            # create a new user cookie
            cookie = cookie_id()

            # put a new user object into the database
            user = { '_id': cookie, 'found-hints': [id] }
            users.insert_one(user)
        else:
            # if the found hint hasn't yet been found
            #if found_hint not in user['found-hints']:
            #    user['found-hints'].append(found_hint)
            users.update_one({ '_id': user_id }, { '$addToSet': { 'found-user': id } }, upsert=True)

        return { 'hint': hint_from_id, 'cookie': cookie, 'game': game, 'user': user }

    # return 404 page
    return None