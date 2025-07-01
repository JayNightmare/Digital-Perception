import React from 'react';
import '../styles/mission.css';

function Mission() {
    return (
        <div className="mission-container">
            <div className="mission-content">
                <h1>Our Ultimate Goal</h1>
                <p>
                    At Augmented Perception, our ultimate goal is to revolutionize the way people interact with technology through augmented reality. We aim to create innovative software solutions that seamlessly integrate digital information into the physical world, enhancing human perception and interaction. 
                </p>

                {/* Short Term Goal */}
                <div className='mission-card mission-short-section'>
                    <h2>Short Term Goal</h2>
                    <p>
                        The short term goal is to develop software for augmented reality glasses that allows users to experience a seamless blend of the digital and physical worlds. We believe in the transformative power of AR technology and its potential to revolutionize how we interact with information and our surroundings.
                    </p>
                    <p>
                        Currently, we're aiming our focus on ensuring that the software we develop is able to be easy to use and that the AI training is able to be done by anyone, regardless of their technical background. We want to make sure that our software is accessible and user-friendly, allowing anyone to benefit from the power of augmented reality.
                    </p>
                </div>

                {/* Long Term Goal */}
                <div className='mission-card mission-long-section'>
                    <h2>Long Term Goal</h2>
                    <p>
                        Our long term goal is much more ambitious. We envision a future where BMI (Brain-Machine Interface) technology is integrated with augmented reality, allowing users to control digital environments with their thoughts. This would create a truly immersive experience, where the boundaries between the physical and digital worlds are blurred.
                    </p>
                    <p>
                        We're aiming to develop software and hardware that is able to use brain waves to control digital environments, allowing users to interact with technology in a more natural and intuitive way. This would open up a whole new world of possibilities for how we interact with information and our surroundings.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Mission;