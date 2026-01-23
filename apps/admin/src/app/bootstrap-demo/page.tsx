"use client";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";
import Badge from "react-bootstrap/Badge";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import { useState } from "react";

export default function BootstrapDemoPage() {
  const [showAlert, setShowAlert] = useState(true);

  return (
    <>
      {/* Bootstrap Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand href="#">Bootstrap Demo</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#features">Features</Nav.Link>
              <Nav.Link href="#pricing">Pricing</Nav.Link>
            </Nav>
            <Nav>
              <Nav.Link href="/dashboard">← Back to Dashboard</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container>
        {/* Alert */}
        {showAlert && (
          <Alert variant="info" dismissible onClose={() => setShowAlert(false)}>
            <Alert.Heading>Welcome to the Bootstrap Demo!</Alert.Heading>
            <p className="mb-0">
              This page uses Bootstrap 5 styling isolated from the rest of the
              Tailwind-based admin app.
            </p>
          </Alert>
        )}

        {/* Hero Section */}
        <div className="p-5 mb-4 bg-light rounded-3">
          <Container fluid className="py-5">
            <h1 className="display-5 fw-bold">Bootstrap 5 Demo Page</h1>
            <p className="col-md-8 fs-4">
              This page demonstrates using Bootstrap components within a Next.js
              app that primarily uses Tailwind CSS. The Bootstrap styles are
              scoped to this route only.
            </p>
            <Button variant="primary" size="lg">
              Learn More
            </Button>
          </Container>
        </div>

        {/* Cards Grid */}
        <Row className="mb-4">
          <Col md={4}>
            <Card>
              <Card.Body>
                <Card.Title>
                  Primary Card <Badge bg="primary">New</Badge>
                </Card.Title>
                <Card.Text>
                  This is a Bootstrap card component with primary styling.
                </Card.Text>
                <Button variant="primary">Go somewhere</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Body>
                <Card.Title>
                  Success Card <Badge bg="success">Active</Badge>
                </Card.Title>
                <Card.Text>
                  This card demonstrates success variant styling.
                </Card.Text>
                <Button variant="success">Take Action</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Body>
                <Card.Title>
                  Warning Card{" "}
                  <Badge bg="warning" text="dark">
                    Attention
                  </Badge>
                </Card.Title>
                <Card.Text>
                  This card uses warning colors to draw attention.
                </Card.Text>
                <Button variant="warning">Review</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Form Example */}
        <Card className="mb-4">
          <Card.Header>
            <h5 className="mb-0">Bootstrap Form Example</h5>
          </Card.Header>
          <Card.Body>
            <Form>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" placeholder="Enter email" />
                </Form.Group>
                <Form.Group as={Col} controlId="formGridPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" placeholder="Password" />
                </Form.Group>
              </Row>
              <Form.Group className="mb-3" controlId="formGridAddress1">
                <Form.Label>Address</Form.Label>
                <Form.Control placeholder="1234 Main St" />
              </Form.Group>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridCity">
                  <Form.Label>City</Form.Label>
                  <Form.Control />
                </Form.Group>
                <Form.Group as={Col} controlId="formGridState">
                  <Form.Label>State</Form.Label>
                  <Form.Select defaultValue="Choose...">
                    <option>Choose...</option>
                    <option>California</option>
                    <option>New York</option>
                    <option>Texas</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group as={Col} controlId="formGridZip">
                  <Form.Label>Zip</Form.Label>
                  <Form.Control />
                </Form.Group>
              </Row>
              <Form.Group className="mb-3" id="formGridCheckbox">
                <Form.Check type="checkbox" label="Check me out" />
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </Card.Body>
        </Card>

        {/* Table Example */}
        <Card className="mb-4">
          <Card.Header>
            <h5 className="mb-0">Bootstrap Table Example</h5>
          </Card.Header>
          <Card.Body>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Username</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Mark</td>
                  <td>Otto</td>
                  <td>@mdo</td>
                  <td>
                    <Badge bg="success">Active</Badge>
                  </td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Jacob</td>
                  <td>Thornton</td>
                  <td>@fat</td>
                  <td>
                    <Badge bg="warning" text="dark">
                      Pending
                    </Badge>
                  </td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>Larry</td>
                  <td>Bird</td>
                  <td>@twitter</td>
                  <td>
                    <Badge bg="danger">Inactive</Badge>
                  </td>
                </tr>
              </tbody>
            </Table>
          </Card.Body>
        </Card>

        {/* Button Variants */}
        <Card className="mb-4">
          <Card.Header>
            <h5 className="mb-0">Button Variants</h5>
          </Card.Header>
          <Card.Body>
            <div className="d-flex flex-wrap gap-2">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="success">Success</Button>
              <Button variant="warning">Warning</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="info">Info</Button>
              <Button variant="light">Light</Button>
              <Button variant="dark">Dark</Button>
              <Button variant="outline-primary">Outline Primary</Button>
              <Button variant="outline-secondary">Outline Secondary</Button>
            </div>
          </Card.Body>
        </Card>

        {/* Footer */}
        <footer className="py-4 my-4 border-top">
          <p className="text-center text-muted">
            © 2026 Bootstrap Demo - Powered by React-Bootstrap
          </p>
        </footer>
      </Container>
    </>
  );
}
