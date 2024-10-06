import os
import time
import PyPDF2  # Import PDF library
from groq import Groq
from dotenv import load_dotenv
import openai

# Load environment variables from .env file
load_dotenv()

# Set up Groq client using the API key from the environment variable
groq_api_key = os.getenv("GROQ_API_KEY")
groq_client = Groq(api_key=groq_api_key)

# Set up OpenAI client using the API key from the environment variable
sambanova_api_key = os.getenv("SAMBANOVA_API_KEY")
openai_client = openai.OpenAI(
    api_key=sambanova_api_key,
    base_url="https://api.sambanova.ai/v1",
)

# Define a function to get a response from the Groq API
def get_response(model, prompt):
    start_time = time.time()  # Record the start time
    chat_completion = groq_client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model=model
    )
    end_time = time.time()  # Record the end time
    response_time = end_time - start_time

    # Extract only the PDF number from the response
    response_text = chat_completion.choices[0].message.content.strip()
    pdf_number = ''.join(filter(str.isdigit, response_text))  # Extract digits only
    
    return pdf_number, response_time

# Define a function to create a strong PDF classification prompt with examples
def create_pdf_classification_prompt(user_input):
    prompt = f"""
    You are an expert on exoplanets and your job is to decide which PDF is the most relevant to answer the user's query. Below is the list of available PDFs:

    1. Current Research and Future Plans to Discover and Study Exoplanets
    2. Exoplanets discovery methods
    3. Famous Exoplanets
    4. Formation of Exoplanets
    5. Habitability of Exoplanets
    6. Technologies Supporting Exoplanet Detection and Study
    7. Types of exoplanets
    8. What are exoplanets, history and why important

    Example queries:
    
    - "What are the best methods to discover exoplanets?" → 2
    - "Tell me about the habitability of exoplanets." → 5
    - "Can you explain the types of exoplanets?" → 7
    - "What are some famous exoplanets?" → 3

    User query: "{user_input}"

    Return only the number of the most relevant PDF. Do not include any additional text.
    """
    return prompt

# Define a function to extract text from the relevant PDF
def extract_pdf_text(pdf_number):
    pdf_files = {
        '1': 'Data/Current Research and Future Plans to Discover and Study Exoplanets.pdf',
        '2': 'Data/Exoplanets discovery methods.pdf',
        '3': 'Data/Famous Exoplanets.pdf',
        '4': 'Data/Formation of Exoplanets.pdf',
        '5': 'Data/Habitability of Exoplanets.pdf',
        '6': 'Data/Technologies Supporting Exoplanet Detection and Study.pdf',
        '7': 'Data/Types of exoplanets.pdf',
        '8': 'Data/What are exoplanets, history and why important.pdf'
    }
    
    # Get the filename for the corresponding PDF number
    pdf_file_path = pdf_files.get(pdf_number)
    
    if pdf_file_path and os.path.exists(pdf_file_path):
        # Open the PDF file and extract text
        with open(pdf_file_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            text = ""
            for page in reader.pages:
                text += page.extract_text() + "\n"  # Concatenate text from each page
        return text.strip()  # Return the extracted text
    return None  # Return None if no relevant data is found

# Define a function to generate a lesson plan using the extracted text and user input
def generate_lesson_plan(extracted_text, user_input):
    if extracted_text:
        prompt = f"""
        You are an expert educator. Based on the following information, create a comprehensive lesson plan:

        - **Extracted Information:** {extracted_text}
        - **User Input:** {user_input}

        The lesson plan should include the following headings: 
        - Objectives
        - Material Needed
        - Lesson Outline
        - Introduction
        - Presentation
        - Group Activity
        - Activity Discussion
        - Wrap Up
        - Home Assignment
        """
    else:
        prompt = f"""
        You are an expert educator. Create a comprehensive lesson plan based on the following user input, using your general knowledge about exoplanets:

        - **User Input:** {user_input}

        The lesson plan should include the following headings: 
        - Objectives
        - Material Needed
        - Lesson Outline
        - Introduction
        - Presentation
        - Group Activity
        - Activity Discussion
        - Wrap Up
        - Home Assignment
        """
    
    response = openai_client.chat.completions.create(
        model='Meta-Llama-3.1-70B-Instruct',
        messages=[{"role": "system", "content": "You are a helpful assistant."},
                  {"role": "user", "content": prompt}],
        temperature=0.1,
        top_p=0.1
    )
    
    return response.choices[0].message.content

def create_lesson_plan_from_user_input(user_input: str):
    classification_prompt = create_pdf_classification_prompt(user_input)
    # Fixed model selection for LLaMA 3.1-8B
    selected_model = "llama3-8b-8192"
        
    
    pdf_number, response_time = get_response(selected_model, classification_prompt)
    
    # Extract relevant text from the PDF
    pdf_text = extract_pdf_text(pdf_number.strip())
    
    # Generate the lesson plan based on extracted text and user input
    lesson_plan = generate_lesson_plan(pdf_text, user_input)
    
    # Create PDF
    return "", lesson_plan
