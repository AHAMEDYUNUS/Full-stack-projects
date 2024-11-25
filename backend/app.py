from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

# Initialize the Flask app
app = Flask(__name__)
CORS(app)

# Configure the database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///todos.db'  # SQLite database file
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the database
db = SQLAlchemy(app)

# Define the database model for the tasks
class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)  # Unique ID for each task
    username = db.Column(db.String(100), nullable=False)  # Username associated with the task
    task = db.Column(db.String(200), nullable=False)  # The task description
    completed = db.Column(db.Boolean, default=False)  # Task completion status

# Routes for the API
@app.route('/todos', methods=['GET'])
def get_todos():
    """Fetch all tasks."""
    todos = Todo.query.all()
    return jsonify([{"id": t.id, "username": t.username, "task": t.task, "completed": t.completed} for t in todos])

@app.route('/todos', methods=['POST'])
def add_todo():
    """Add a new task."""
    data = request.json
    new_todo = Todo(username=data['username'], task=data['task'])
    db.session.add(new_todo)
    db.session.commit()
    return jsonify({"message": "Seekiram velaiya mudi da!"})

@app.route('/todos/<int:id>', methods=['PUT'])
def update_todo(id):
    """Update an existing task or toggle its completion."""
    todo = Todo.query.get(id)
    if todo:
        data = request.json
        todo.task = data.get('task', todo.task)
        todo.username = data.get('username', todo.username)
        todo.completed = data.get('completed', todo.completed)
        db.session.commit()
        return jsonify({"message": "Task updated Mameyyy!"})
    return jsonify({"error": "Task not found"}), 404

@app.route('/todos/<int:id>', methods=['DELETE'])
def delete_todo(id):
    """Delete a task."""
    todo = Todo.query.get(id)
    if todo:
        db.session.delete(todo)
        db.session.commit()
        return jsonify({"message": "Task deleted Machi!"})
    return jsonify({"error": "Task not found"}), 404

# Run the app
if __name__ == '__main__':
    # Create the database tables before running the app
    with app.app_context():
        db.create_all()  # Ensure this runs inside the application context
        print("Database initialized!")
    app.run(debug=True)
