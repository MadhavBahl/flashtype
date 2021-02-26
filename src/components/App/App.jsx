import React from "react";
import ChallengeSection from "../ChallengeSection/ChallengeSection";
import Footer from "../Footer/Footer";
import Landing from "../Landing/Landing";
import Nav from "../Nav/Nav";
import { SAMPLE_PARAGRAPHS } from "./../../data/sampleParagraphs";
import "./App.css";

const TotalTime = 60;
const ServiceUrl = "http://metaphorpsum.com/paragraphs/1/9";
const DefaultState = {
    selectedParagraph: "",
    timerStarted: false,
    timeRemaining: TotalTime,
    words: 0,
    characters: 0,
    wpm: 0,
    testInfo: [],
};

class App extends React.Component {
    state = DefaultState;

    fetchNewParagraphFallback = () => {
        const data =
            SAMPLE_PARAGRAPHS[
                Math.floor(Math.random() * SAMPLE_PARAGRAPHS.length)
            ];

        const selectedParagraphArray = data.split("");
        const testInfo = selectedParagraphArray.map((selectedLetter) => {
            return {
                testLetter: selectedLetter,
                status: "notAttempted",
            };
        });

        this.setState({
            ...DefaultState,
            testInfo,
            selectedParagraph: data,
        });
    };

    fetchNewParagraph = () => {
        fetch(ServiceUrl)
            .then((response) => response.text())
            .then((data) => {
                const selectedParagraphArray = data.split("");
                const testInfo = selectedParagraphArray.map(
                    (selectedLetter) => {
                        return {
                            testLetter: selectedLetter,
                            status: "notAttempted",
                        };
                    }
                );

                this.setState({
                    ...DefaultState,
                    testInfo,
                    selectedParagraph: data,
                });
            });
    };

    componentDidMount() {
        this.fetchNewParagraphFallback();
    }

    startTimer = () => {
        this.setState({ timerStarted: true });
        const timer = setInterval(() => {
            if (this.state.timeRemaining > 0) {
                // Change the WPM
                const timeSpent = TotalTime - this.state.timeRemaining;
                const wpm =
                    timeSpent > 0
                        ? (this.state.words / timeSpent) * TotalTime
                        : 0;
                this.setState({
                    timeRemaining: this.state.timeRemaining - 1,
                    wpm: parseInt(wpm),
                });
            } else {
                clearInterval(timer);
            }
        }, 1000);
    };

    startAgain = () => this.fetchNewParagraphFallback();

    handleUserInput = (inputValue) => {
        if (!this.state.timerStarted) this.startTimer();

        /**
         * 1. Handle the underflow case - all the characters should be shown as not-attempted - early exit
         * 2. Handle the overflow case - early exit
         * 3. Handle the backspace
         *      - Mark the [index + 1] element as not-Attempted (irrespective of whether the index is less than zero)
         *      - But, don't forget to check for the overflow case here
         *        (index + 1 -> out of bound, when index === length - 1)
         * 4. Update the status in the test info
         *      - Find out the last character in the inputValue and it's index
         *      - Check if the character at same index in testInfo (state) matches
         *      - Yes -> "correct"
         *        No  -> "incorrect"
         * 5. Irrespected of the case, characters, words, and speec (wpm) can be update
         */

        const characters = inputValue.length;
        const words = inputValue.split(" ").length;
        const index = characters - 1;

        if (index < 0) {
            this.setState({
                testInfo: [
                    {
                        testLetter: this.state.testInfo[0].testLetter,
                        status: "notAttempted",
                    },
                    ...this.state.testInfo.slice(1),
                ],
                characters,
                words,
            });

            return;
        }

        if (index >= this.state.selectedParagraph.length) {
            this.setState({ characters, words });
            return;
        }

        // Make a copy of testInfo
        const testInfo = this.state.testInfo;
        if (!(index === this.state.selectedParagraph.length - 1))
            testInfo[index + 1].status = "notAttempted";

        // Check for the correct typed letter
        const isCorrect = inputValue[index] === testInfo[index].testLetter;

        // Update the testInfo
        testInfo[index].status = isCorrect ? "correct" : "incorrect";

        // Update the state
        this.setState({
            testInfo,
            words,
            characters,
        });
    };

    render() {
        return (
            <div className="app">
                {/* Nav Section */}
                <Nav />

                {/* Landing Page */}
                <Landing />

                {/* Challenge Section */}
                <ChallengeSection
                    selectedParagraph={this.state.selectedParagraph}
                    words={this.state.words}
                    characters={this.state.characters}
                    wpm={this.state.wpm}
                    timeRemaining={this.state.timeRemaining}
                    timerStarted={this.state.timerStarted}
                    testInfo={this.state.testInfo}
                    onInputChange={this.handleUserInput}
                    startAgain={this.startAgain}
                />

                {/* Footer */}
                <Footer />
            </div>
        );
    }
}

export default App;
