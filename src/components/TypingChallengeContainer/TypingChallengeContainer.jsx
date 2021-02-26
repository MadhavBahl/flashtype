import React from "react";
import ChallengeDetailsCard from "../ChallengeDetailsCard/ChallengeDetailsCard";
import TypingChallenge from "../TypingChallenge/TypingChallenge";
import "./TypingChallengeContainer.css";

const TypingChallengeContainer = ({
    selectedParagraph,
    words,
    characters,
    wpm,
    timeRemaining,
    timerStarted,
    testInfo,
    onInputChange,
}) => {
    return (
        <div className="typing-challenge-container">
            {/* Details Section */}
            <div className="details-container">
                {/* Words Typed */}
                <ChallengeDetailsCard cardName="Words" cardValue={words} />

                {/* Charaters Typed */}
                <ChallengeDetailsCard
                    cardName="Characters"
                    cardValue={characters}
                />

                {/* Speed */}
                <ChallengeDetailsCard cardName="Speed" cardValue={wpm} />
            </div>

            {/* The REAL Challenge */}
            <div className="typewriter-container">
                <TypingChallenge
                    onInputChange={onInputChange}
                    testInfo={testInfo}
                    timerStarted={timerStarted}
                    timeRemaining={timeRemaining}
                    selectedParagraph={selectedParagraph}
                />
            </div>
        </div>
    );
};

export default TypingChallengeContainer;
