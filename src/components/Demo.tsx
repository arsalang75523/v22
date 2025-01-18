"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "~/components/ui/Button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export default function GameDemo({ title }: { title?: string } = { title: "Number Guessing Game" }) {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [gameMessage, setGameMessage] = useState<string | null>("Start guessing!");
  const [userGuess, setUserGuess] = useState<number | null>(null);
  const [randomNumber, setRandomNumber] = useState<number | null>(null);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    const load = async () => {
      console.log("Game SDK Loaded");
      setRandomNumber(Math.floor(Math.random() * 100) + 1); // Generate a random number between 1 and 100
    };

    if (!isSDKLoaded) {
      setIsSDKLoaded(true);
      load();
    }
  }, [isSDKLoaded]);

  const handleGuess = useCallback(() => {
    if (userGuess === null || randomNumber === null) {
      setGameMessage("Please enter a number.");
      return;
    }

    setAttempts((prev) => prev + 1);

    if (userGuess === randomNumber) {
      setGameMessage(`🎉 Congratulations! You guessed it in ${attempts + 1} attempts.`);
    } else if (userGuess > randomNumber) {
      setGameMessage("📉 Too high! Try again.");
    } else {
      setGameMessage("📈 Too low! Try again.");
    }
  }, [userGuess, randomNumber, attempts]);

  const resetGame = useCallback(() => {
    setRandomNumber(Math.floor(Math.random() * 100) + 1);
    setAttempts(0);
    setUserGuess(null);
    setGameMessage("Start guessing!");
  }, []);

  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-[300px] mx-auto py-2 px-2">
      <h1 className="text-2xl font-bold text-center mb-4">{title}</h1>
      <div className="mb-4">
        <Label className="text-xs font-semibold text-gray-500 mb-1" htmlFor="guess-input">
          Your Guess
        </Label>
        <Input
          id="guess-input"
          type="number"
          value={userGuess || ""}
          onChange={(e) => setUserGuess(Number(e.target.value))}
          className="mb-2"
          step="1"
          min="1"
          max="100"
        />
      </div>
      <Button onClick={handleGuess} className="mb-4">
        Submit Guess
      </Button>
      <Button onClick={resetGame} className="mb-4">
        Reset Game
      </Button>
      <div className="p-4 mt-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <pre className="font-mono text-xs whitespace-pre-wrap break-words max-w-[260px]">
          {gameMessage}
        </pre>
      </div>
    </div>
  );
}
 