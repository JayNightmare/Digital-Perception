import React from "react";
import "../styles/hire.css";
import "../styles/hire.css";

function Hire() {
    return (
        <div className="hire-container">
            <div className="hire-content">
                <h1>Want To Join The Team?</h1>
                <p>
                    We are always looking for talented individuals to join our
                    team. If you are passionate hire technology and innovation,
                    we would love to hear from you!
                </p>

                <div className="hire-card apply-card">
                    <h2>How To Apply</h2>
                    <p align="center">
                        If you're interested in joining the team, there are a
                        few ways you can get involved:
                    </p>
                </div>

                {/* 3 cards: 1 for each way to apply
            1. Easy way: Join the discord server and bug test
            2. Medium way: Contribute to our GitHub projects
            3. Hard way: Apply for a position via email with your CV and portfolio
        */}

                <div className="hire-cards">
                    {/* Easy Mode */}
                    <div className="hire-card">
                        <h1 className="green-easy hire-method">Easy Way</h1>
                        <h2>Join Our Discord</h2>
                        <p>
                            The easiest way to get involved is to join our
                            Discord server. Here, you can meet the team, ask
                            questions, and help us bug test our projects.
                        </p>
                        <p>
                            <a
                                href="https://discord.gg/vCNcw5A4NN"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Join our Discord Server
                            </a>{" "}
                            and introduce yourself. We have channels for bug
                            testing, general discussion, and project updates.
                            Your feedback is invaluable to us, and we appreciate
                            any help you can provide in making our projects
                            better.
                        </p>
                        <p fontStyle={{ fontStyle: "italic" }}>
                            Currently a work in progress
                        </p>
                    </div>

                    {/* Medium Mode */}
                    <div className="hire-card">
                        <h1 className="yellow-medium hire-method">
                            Medium Way
                        </h1>
                        <h2>Contribute on GitHub</h2>
                        <p>
                            If you have experience with coding, you can
                            contribute to our projects on GitHub. We welcome
                            pull requests and issues, and it's a great way to
                            showcase your skills.
                        </p>
                        <p>
                            <a
                                href="github.com/Augmented-Perception"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Visit the GitHub
                            </a>{" "}
                            and check out our projects. Feel free to fork the
                            repositories and submit pull requests. Detailed
                            information on how to contribute can be found in the
                            README files of each project, along with good first
                            issues to get started.
                        </p>
                    </div>

                    {/* Hard Mode */}
                    <div className="hire-card">
                        <h1 className="red-hard hire-method">Hard Way</h1>
                        <h2>Apply for a Position</h2>
                        <p>
                            If you're looking for a more formal role, you can
                            apply for a position via email. Please include your
                            CV and portfolio, along with a brief introduction
                            about yourself and why you want to join our team.
                        </p>
                        <p>
                            Send your application to{" "}
                            <a
                                href="mailto:jn3.enquiries@gmail.com"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                jn3.enquiries@gmail.com
                            </a>
                            . We are looking for individuals who are passionate
                            about technology, eager to learn, and ready to
                            contribute to exciting projects. Please include any
                            relevant experience or projects you've worked on in
                            your application.
                        </p>
                    </div>
                </div>

                {/* Why Join Us? */}
                <div className="hire-card">
                    <h2>Why Join Us?</h2>
                    <p>
                        At Augmented Perception, we are dedicated to pushing the
                        boundaries of technology and innovation. By joining our
                        team, you will have the opportunity to work on exciting
                        projects, collaborate with like-minded individuals, and
                        contribute to the future of technology.
                    </p>
                    {/* Talk about the orgs mission to build AR hardware and software, and how this is a unique opportunity to be a part of something new and innovative. */}
                    <p>
                        Our mission is to create cutting-edge AR hardware and
                        software that will revolutionize the way we interact
                        with the digital world. This is a unique opportunity to
                        be part of a team that is at the forefront of
                        innovation, working on projects that have the potential
                        to change the way we perceive and interact with
                        technology.
                    </p>
                </div>

                {/* What skills do we need? */}
                <div className="hire-card">
                    <h2>What Skills Do We Need?</h2>
                    <p>
                        We are looking for individuals with a variety of skills,
                        including but not limited to:
                    </p>
                    <ul>
                        <li>
                            Software development (JavaScript, Python, C++, etc.)
                        </li>
                        <li>Web development (React, Node.js, etc.)</li>
                        <li>AR/VR development (Unity, Unreal Engine, etc.)</li>
                        <li>UI/UX design</li>
                        <li>Project management</li>
                    </ul>
                    <p>
                        If you have experience in any of these areas or are
                        eager to learn, we would love to hear from you!
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Hire;
