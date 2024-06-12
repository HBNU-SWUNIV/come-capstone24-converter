import PyPDF2
import nltk
from urllib.request import urlopen, urlretrieve
from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.lex_rank import LexRankSummarizer

def summarize(file_path):
    # Read the PDF in binary mode
    filename = 'temp.pdf'
    urlretrieve(file_path, filename)
    with open(filename, 'rb') as file:
        pdf_reader = PyPDF2.PdfReader(file)
        text = ''

        # Extract text from each page
        for page_num in range(len(pdf_reader.pages)):
            page = pdf_reader.pages[page_num]
            text += page.extract_text()

    # Parse the extracted text
    parser = PlaintextParser.from_string(text, Tokenizer("english"))
    summarizer = LexRankSummarizer()

    # Customize your summary's length
    summary = summarizer(parser.document, sentences_count=5)

    return '\n'.join(map(str, summary))

if __name__ == "__main__":
    file_path = "1705.01844.pdf"
    summarize(file_path)

