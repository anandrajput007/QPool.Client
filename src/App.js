import React, { useState, useEffect } from 'react';
import './App.css';
import data from './data.json';
import { Card, Button, Container, Row, Col, Modal, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faPlus } from '@fortawesome/free-solid-svg-icons';


function App() {
  const [technologies, setTechnologies] = useState([]);
  const [selectedTech, setSelectedTech] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showCards, setShowCards] = useState(true);
  const [fetchedData, setFetchedData] = useState([]);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [askedQuestions, setAskedQuestions] = useState([]);
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  useEffect(() => {
    // Fetch data from the API
    fetch('https://localhost:7017/api/Technology/technologies')
      .then(response => response.json())
      .then(data => setTechnologies(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleCardClick = (tech) => {
    setSelectedTech(tech);
    setCurrentQuestionIndex(0);
    setShowAnswer(false);
    setShowCards(false);
    setQuestionNumber(1);
    setAskedQuestions([]);
    fetch(`https://localhost:7017/api/Technology/technologies/${tech.technologyID}`)
      .then(response => response.json())
      .then(data => {
        console.log('API response:', data);
        setFetchedData(data.questions || []);
      })
      .catch(error => console.error('Error fetching technology details:', error));
  };

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  const handleNextQuestion = () => {
    if (fetchedData && fetchedData.length > 0) {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * fetchedData.length);
      } while (askedQuestions.includes(randomIndex) && askedQuestions.length < fetchedData.length);

      setAskedQuestions([...askedQuestions, randomIndex]);
      setCurrentQuestionIndex(randomIndex);
      setShowAnswer(false);
      setQuestionNumber((prevNumber) => prevNumber + 1);
    } else {
      console.error('No questions available');
    }
  };

  const handleBack = () => {
    setShowCards(true);
    setSelectedTech(null);
    setFetchedData([]);
  };

  return (
    <div className='outer-border'>
      {showCards ? (
        <Row>
          {technologies.map((tech) => (
            <Col key={tech.technologyID} md={3}>
              <Card onClick={() => handleCardClick(tech)} className="mb-4">
                <Card.Body>
                  <Card.Title>{tech.name}</Card.Title>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <div>
          <div>
          <div className='header'>
            <h4>{selectedTech.name}</h4>
            <div className="button-container">
              <Button onClick={handleShow}  className="btn btn-success">
                <FontAwesomeIcon icon={faPlus} />
              </Button>

              <Button onClick={handleBack} className="btn btn-primary">
                <FontAwesomeIcon icon={faHome} />
              </Button>
            </div>
          </div>

          <Modal size="lg" show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Add Question</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="formTechnology">
                  <Form.Label>Technology</Form.Label>
                  <Form.Control as="select">
                    <option value="">Select Technology</option>
                    <option value="1">Technology 1</option>
                    <option value="2">Technology 2</option>
                    {/* Add more options as needed */}
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="formQuestion">
                  <Form.Label>Question</Form.Label>
                  <Form.Control type="text" />
                </Form.Group>
                <Form.Group controlId="formAnswer">
                  <Form.Label>Answer</Form.Label>
                  <Form.Control as="textarea" rows={10} />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" >
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>

            {selectedTech && fetchedData.length > 0 && (
            <div>
              <div className='mt-4'>
                <h5>Question {questionNumber}: {fetchedData[currentQuestionIndex].questionText}</h5>
              </div>

              <div className={`answer-box ${showAnswer ? 'show-answer' : ''}`}>              
                {showAnswer && (<div><h6>Answer: </h6>
                <p>{fetchedData[currentQuestionIndex].answer}</p></div>)}              
              </div>

              <div className='btn-group1'>
              <Button onClick={handleShowAnswer} className="btn btn-secondary mr-5">Show Answer</Button>
              <Button 
                  onClick={handleNextQuestion} 
                  disabled={askedQuestions.length >= fetchedData.length}
                  className='btn btn-primary'
                >
                  Next
                </Button>
              </div>
            </div>
          )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
