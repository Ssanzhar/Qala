# Qala

## 🏙️ Introduction

**Qala** is a citizen-centric web platform designed to empower Kazakhstan’s city communities to report, track, and discuss local issues. Through an interactive map interface, users can visualize reported problems in their neighborhoods. The platform enables issue ranking via upvotes/downvotes, encouraging collaborative prioritization of community needs.

Built with scalability in mind, Qala is ready for seamless integration with local government systems to enhance transparency, resource allocation, and governance.

## 📄 Documentation

For detailed documentation, refer to the [Project's documentation](https://docs.google.com/document/d/1nZB1fy8Al20xBNipCXVEs4ODLpCNnzxJ/edit?usp=sharing&ouid=113911636319581141972&rtpof=true&sd=true).

## ⚙️ Tech Stack

- **Frontend**: React
- **Backend**: Django REST Framework
- **AI-Powered Search**: Smart search system powered by the ChatGPT API. Users can naturally describe their concerns or issues, and the system intelligently interprets the input to match relevant existing reports or suggest new entries.
- **Map Integration**: Interactive issue visualization
- **Version Control**: Git



## 🗂️ Project Structure

```
infomatrix.ss.final/
│-- qala_frontend/     # React frontend application
│-- qala_backend/      # Django backend with REST API
│-- .gitignore         # Git ignore rules
│-- README.md          # Project documentation
│-- LICENSE            # MIT License
```

## 🛠️ Installation

### Prerequisites

Ensure the following are installed:

- [Node.js](https://nodejs.org/)
- [Python](https://www.python.org/)
- [Git](https://git-scm.com/)

### Clone the Repository

```bash
git clone https://github.com/Ssanzhar/Qala
cd Qala
```

### Install Dependencies

#### Backend (Python)

```bash
cd qala_backend
pip install -r requirements.txt
```

#### Frontend (React)

```bash
cd ../qala_frontend
npm install
```

## 🚀 Usage

### Running the Backend

```bash
cd qala_backend
python manage.py runserver
```

### Running the Frontend

```bash
cd qala_frontend
npm start
```

## 📄 License

This project is licensed under the MIT License.
