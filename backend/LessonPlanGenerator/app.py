import os
import time
import logging
import PyPDF2  # Import PDF library
from groq import Groq
from dotenv import load_dotenv
import openai

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables from .env file
logger.info("Loading environment variables")
load_dotenv()

# Check if API keys are available
groq_api_key = os.getenv("GROQ_API_KEY")
sambanova_api_key = os.getenv("SAMBANOVA_API_KEY")

if not groq_api_key:
    logger.error("GROQ_API_KEY not found in environment variables")
if not sambanova_api_key:
    logger.error("SAMBANOVA_API_KEY not found in environment variables")

try:
    # Set up Groq client using the API key from the environment variable
    logger.info("Setting up Groq client")
    groq_client = Groq(api_key=groq_api_key)

    # Set up OpenAI client using the API key from the environment variable
    logger.info("Setting up SambaNova client")
    openai_client = openai.OpenAI(
        api_key=sambanova_api_key,
        base_url="https://api.sambanova.ai/v1",
    )
except Exception as e:
    logger.error(f"Error setting up API clients: {str(e)}")


# Define a function to get a response from the Groq API
def get_response(model, prompt):
    logger.info(f"Calling Groq API with model: {model}")
    try:
        start_time = time.time()  # Record the start time
        chat_completion = groq_client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model=model
        )
        end_time = time.time()  # Record the end time
        response_time = end_time - start_time
        logger.info(f"Groq API response time: {response_time:.2f} seconds")

        # Extract only the PDF number from the response
        response_text = chat_completion.choices[0].message.content.strip()
        logger.info(f"Raw Groq response: {response_text}")
        pdf_number = ''.join(filter(str.isdigit, response_text))  # Extract digits only
        logger.info(f"Extracted PDF number: {pdf_number}")

        return pdf_number, response_time
    except Exception as e:
        logger.error(f"Error calling Groq API: {str(e)}")
        return "1", 0  # Default to PDF 1 as fallback


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
    import os
    import logging
    logger = logging.getLogger(__name__)

    logger.info(f"Extracting text from PDF number: {pdf_number}")

    # Define possible base paths to look for PDFs
    possible_base_paths = [
        'Data/',  # Relative to project root
        './Data/',  # Explicitly in current directory
        os.path.join(os.getcwd(), 'Data/'),  # Absolute path in current directory
        '/app/Data/',  # Docker container common path
        os.path.join(os.path.dirname(os.path.dirname(__file__)), 'Data/'),  # Up one level from app
    ]

    pdf_files = {
        '1': 'Current Research and Future Plans to Discover and Study Exoplanets.pdf',
        '2': 'Exoplanets discovery methods.pdf',
        '3': 'Famous Exoplanets.pdf',
        '4': 'Formation of Exoplanets.pdf',
        '5': 'Habitability of Exoplanets.pdf',
        '6': 'Technologies Supporting Exoplanet Detection and Study.pdf',
        '7': 'Types of exoplanets.pdf',
        '8': 'What are exoplanets, history and why important.pdf'
    }

    # Get the filename for the corresponding PDF number
    pdf_filename = pdf_files.get(pdf_number)

    if not pdf_filename:
        logger.error(f"No PDF file mapping found for PDF number: {pdf_number}")
        return None

    # Try all possible base paths
    for base_path in possible_base_paths:
        pdf_file_path = base_path + pdf_filename
        logger.info(f"Trying PDF path: {pdf_file_path}")

        if os.path.exists(pdf_file_path):
            logger.info(f"Found PDF at: {pdf_file_path}")
            try:
                # Import here to avoid issues if PyPDF2 is not installed
                import PyPDF2

                # Open the PDF file and extract text
                with open(pdf_file_path, 'rb') as file:
                    reader = PyPDF2.PdfReader(file)
                    text = ""
                    for page in reader.pages:
                        text += page.extract_text() + "\n"  # Concatenate text from each page
                logger.info(f"Successfully extracted {len(text)} characters from PDF")
                return text.strip()  # Return the extracted text
            except Exception as e:
                logger.error(f"Error extracting text from PDF: {str(e)}")
                return None

    # If we've tried all paths and none work
    logger.error(f"PDF file not found in any of the tried locations: {pdf_filename}")

    # List all files in Data directory if we can find it
    for base_path in possible_base_paths:
        if os.path.exists(base_path):
            logger.info(f"Found Data directory at: {base_path}")
            logger.info(f"Files in directory: {os.listdir(base_path)}")

    return None  # Return None if no relevant data is found


# Define a function to generate a lesson plan using the extracted text and user input
def generate_lesson_plan(extracted_text, user_input):
    logger.info("Generating lesson plan")
    try:
        if extracted_text:
            logger.info(f"Using extracted text ({len(extracted_text)} chars) and user input")
            prompt = f"""
            You are an expert educator. Based on the following information, create a comprehensive lesson plan:

            - **Extracted Information:** {extracted_text[:2000]}... (truncated for prompt size)
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
            logger.info("No extracted text available, using only user input")
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

        logger.info("Calling SambaNova API for lesson plan generation")
        response = openai_client.chat.completions.create(
            model='Meta-Llama-3.1-70B-Instruct',
            messages=[{"role": "system", "content": "You are a helpful assistant."},
                      {"role": "user", "content": prompt}],
            temperature=0.1,
            top_p=0.1
        )

        lesson_content = response.choices[0].message.content
        logger.info(f"Generated lesson plan with {len(lesson_content)} characters")
        return lesson_content
    except Exception as e:
        logger.error(f"Error generating lesson plan: {str(e)}")
        # Return a fallback lesson plan
        return """
        # Error Generating Lesson Plan

        We apologize, but there was an error generating your lesson plan. This could be due to:

        - API service unavailability
        - Missing API credentials
        - Network connectivity issues

        Please try again later or contact support if the problem persists.
        """


def create_lesson_plan_from_user_input(user_input: str):
    logger.info(f"Creating lesson plan from user input: {user_input[:100]}...")
    try:
        # Map input to relevant fields if we detect structured data
        if "elementary_school" in user_input or "middle_school" in user_input or "high_school" in user_input:
            logger.info("Detected structured input from form")

        classification_prompt = create_pdf_classification_prompt(user_input)
        # Fixed model selection for LLaMA 3.1-8B
        selected_model = "llama3-8b-8192"

        pdf_number, response_time = get_response(selected_model, classification_prompt)

        # Extract relevant text from the PDF
        pdf_text = extract_pdf_text(pdf_number.strip())

        # Generate the lesson plan based on extracted text and user input
        lesson_plan = generate_lesson_plan(pdf_text, user_input)

        # Return results
        logger.info("Lesson plan creation successful")
        return "", lesson_plan
    except Exception as e:
        logger.error(f"Unexpected error in create_lesson_plan_from_user_input: {str(e)}")
        import traceback
        logger.error(traceback.format_exc())

        # Return a fallback lesson plan
        return "", """
        # Error Generating Lesson Plan

        We apologize, but there was an error generating your lesson plan. This could be due to:

        - API service unavailability
        - Missing API credentials
        - Network connectivity issues

        Please try again later or contact support if the problem persists.
        """


# Test that the module is loading correctly
logger.info("LessonPlanGenerator app.py loaded successfully")
