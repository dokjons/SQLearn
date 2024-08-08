from flask import Flask, render_template, request, redirect, url_for
import sqlite3
import os
import random
import faker
import time
import webbrowser

app = Flask(__name__)

DATABASE = 'sandbox.db'
TASK_DATABASE = 'tasks.db'

# Function to connect to the SQLite database
def connect_db(db_name):
    conn = sqlite3.connect(db_name, timeout=10)  # Connect to a file-based SQLite database, increase timeout to handl locks
    conn.execute('PRAGMA journal_mode=WAL')
    return conn

# Tasks db
@app.route('/tasks', methods=['GET'])
def get_tasks():
    user_id = request.args.get('user_id', 1)  # Default to user_id 1
    conn = connect_db(TASK_DATABASE)
    cur = conn.cursor()
    
    # Fetch all tasks with completion status
    cur.execute("""
        SELECT t.id, t.description, t.expected_query, t.hint,
               COALESCE(ut.completed, 0) as completed
        FROM tasks t
        LEFT JOIN user_tasks ut ON t.id = ut.task_id AND ut.user_id = ?
    """, (user_id,))
    
    tasks = cur.fetchall()
    
    # Fetch completed tasks count for the user
    cur.execute("SELECT COUNT(*) FROM user_tasks WHERE user_id = ? AND completed = 1", (user_id,))
    completed_count = cur.fetchone()[0]
    
    # Fetch total tasks count
    cur.execute("SELECT COUNT(*) FROM tasks")
    total_count = cur.fetchone()[0]
    
    conn.close()
    
    return {
        "tasks": tasks,
        "completed_count": completed_count,
        "total_count": total_count
    }


@app.route('/complete_task', methods=['POST'])
def complete_task():
    user_id = request.form['user_id']
    task_id = request.form['task_id']
    retries = 5
    for attempt in range(retries):
        try:
            conn = connect_db(TASK_DATABASE)
            cur = conn.cursor()
            cur.execute("INSERT OR REPLACE INTO user_tasks (user_id, task_id, completed) VALUES (?, ?, 1)", (user_id, task_id))
            conn.commit()
            conn.close()
            return jsonify({"status": "success"})
        except sqlite3.OperationalError as e:
            if "database is locked" in str(e) and attempt < retries - 1:
                time.sleep(1)  # Wait before retrying
            else:
                return jsonify({"status": "error", "message": "Database is locked. Please try again later."})

# Initialize database with some sample data if not already present
def init_db():
    conn = connect_db(DATABASE)
    cur = conn.cursor()

    # Drop all tables in the database
    cur.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cur.fetchall()
    for table in tables:
        cur.execute(f"DROP TABLE IF EXISTS {table[0]};")
    
    # Create a new users table
    cur.execute("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, first_name TEXT, last_name TEXT, age INTEGER, cpr TEXT)")
    cur.execute("INSERT INTO users (first_name, last_name, age, cpr) VALUES ('Alice', 'Smith', 25, '012345-0123')") # Sample data
    conn.commit()
    conn.close()

def generate_random_users(num_rows):
    fake = faker.Faker()
    conn = connect_db(DATABASE)
    cur = conn.cursor()

    insert_statement = "INSERT INTO users (first_name, last_name, age, cpr) VALUES "
    values = []

    for _ in range(num_rows):
        first_name = fake.first_name()
        last_name = fake.last_name()
        age = random.randint(18, 99) # Age between 18 and 99
        cpr = f"{random.randint(100000, 999999)}-{random.randint(1000, 9999)}"
        values.append(f"('{first_name}', '{last_name}', {age}, '{cpr}')")

    insert_statement += ", ".join(values) + ";"

    cur.executescript(insert_statement)
    conn.commit()
    conn.close()

@app.route('/', methods=['GET', 'POST'])
def sandbox():
    result = None
    error = None
    columns = []

    if request.method == 'POST':
        query = request.form['query']
        try:
            conn = connect_db(DATABASE)
            cur = conn.cursor()
            cur.execute(query)
            if query.lower().strip().startswith('select'):
                result = cur.fetchall()
                columns = [desc[0] for desc in cur.description]
            else:
                conn.commit()
                cur.execute("SELECT * FROM users")
                result = cur.fetchall()
                columns = [desc[0] for desc in cur.description]
            conn.close()
        except Exception as e:
            error = str(e)
            result = None
            columns = None
    
    return render_template('sandbox.html', result=result, columns=columns, error=error)

@app.route('/populate', methods=['GET'])
def populate():
    # Generate 1000 random users
    generate_random_users(100)
    return redirect(url_for('sandbox'))

@app.route('/reset', methods=['GET'])
def reset():
    # Initialize the database with sample data
    init_db() # Call the existing init_db function
    return redirect(url_for('sandbox'))

if __name__ == '__main__':
    # Check if database exists; if not, initialize it
    if not os.path.exists(DATABASE):
        init_db()
    webbrowser.open("http://127.0.0.1:5000")
    app.run(debug=False)
