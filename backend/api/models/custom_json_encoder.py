import json

class CustomJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        # Handle any custom types here
        return super().default(obj)