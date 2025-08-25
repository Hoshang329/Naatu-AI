import os
import json
from dotenv import load_dotenv

# Flask for creating the web app
from flask import Flask, request, jsonify
from flask_cors import CORS
# LangChain components
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain.schema.runnable import RunnablePassthrough
from langchain.schema.output_parser import StrOutputParser

# --- 1. LOAD ENVIRONMENT VARIABLES & INITIALIZE ---

# Load environment variables from .env file
load_dotenv()

# Check for API Key
if "GOOGLE_API_KEY" not in os.environ:
    raise ValueError("GOOGLE_API_KEY not found in .env file.")

# Initialize Flask app and CORS
app = Flask(__name__)
CORS(app)
 # This allows our frontend to communicate with this backend

# --- 2. DEFINE CONSTANTS ---

PERSIST_DIRECTORY = "./chroma_db"
EMBEDDING_MODEL = "all-MiniLM-L6-v2"
LLM_MODEL = "models/gemini-2.5-flash-lite"

# --- 3. LOAD THE AI COMPONENTS (MEMORY & BRAIN) ---

# Load the embeddings model that we used to create the database
embeddings = HuggingFaceEmbeddings(model_name=EMBEDDING_MODEL)

# Load the persisted vector database from disk
db = Chroma(persist_directory=PERSIST_DIRECTORY, embedding_function=embeddings)

# Create a retriever from the database
retriever = db.as_retriever(search_kwargs={"k": 5}) # 'k' is the number of relevant chunks to retrieve

# Define the Prompt Template
# This is where we stitch together the context and the question
template = """
You are a friendly and knowledgeable expert for the 'Naatu Ruchulu' brand.
Your goal is to answer customer questions accurately and in the brand's warm, authentic persona.
You must use ONLY the information provided in the 'CONTEXT' below to answer the question.
Do not make anything up. If the information is not in the context, you must say 'I'm sorry, I don't have information on that specific topic, but I can tell you about...' and then mention something relevant from the context.

CONTEXT:
{context}

USER'S QUESTION:
{question}

YOUR ANSWER (in the Naatu Ruchulu persona):
"""
prompt = PromptTemplate.from_template(template)

# Initialize the Gemini LLM
llm = ChatGoogleGenerativeAI(model=LLM_MODEL, temperature=0.7, convert_system_message_to_human=True)

# --- 4. BUILD THE RAG (Retrieval-Augmented Generation) CHAIN ---

# This chain connects all our components together
rag_chain = (
    {"context": retriever, "question": RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)

# --- 5. CREATE THE API ENDPOINT ---

@app.route("/ask", methods=["POST"])
def ask_question():
    """Receives a question from the user, processes it with the RAG chain, and returns the answer."""
    try:
        # Get the JSON data from the request
        data = request.get_json()
        
        # Check if the 'question' key exists
        if "question" not in data:
            return jsonify({"error": "Missing 'question' in request body"}), 400
            
        user_question = data["question"]
        
        # Invoke the RAG chain with the user's question
        print(f"Received question: {user_question}")
        ai_response = rag_chain.invoke(user_question)
        print(f"Generated response: {ai_response}")
        
        return jsonify({"answer": ai_response})

    # NEW AND IMPROVED CODE
    except Exception as e:
    # Import traceback to get detailed error info
        import traceback
        print(f"--- An internal error occurred ---")
        # Print the full traceback to the console
        traceback.print_exc()
        print(f"--- End of error ---")
        return jsonify({"error": f"An internal server error occurred: {str(e)}"}), 500

# --- 6. RUN THE FLASK APP ---

if __name__ == "__main__":
    # Note: We no longer build the database here. We just run the app.
    # The database should be built once using the previous script.
    app.run(host="0.0.0.0", port=5000, debug=True)