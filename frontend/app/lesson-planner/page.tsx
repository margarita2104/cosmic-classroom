"use client"

import { useState, useEffect } from 'react';

import { Mic, MicOff } from "lucide-react"
import starComet from "@/app/assets/images/lesson-planner/star-comet.png"
import spaceshipSmall from "@/app/assets/images/lesson-planner/spaceship-small.png"
import planetHoop from "@/app/assets/images/lesson-planner/planet-hoop.png"

const LessonPlanner = () => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    let recognition: SpeechRecognition | null = null;

    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event) => {
        const current = event.resultIndex;
        const transcriptText = event.results[current][0].transcript;
        setTranscript(transcriptText.trim());
      };

      recognition.onend = () => {
        if (isListening) {
          recognition?.start();
        }
      };
    }

    if (isListening && recognition) {
      recognition.start();
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [isListening]);

  const toggleListening = () => {
    setIsListening(!isListening);
  };

  return (
    <main className="flex flex-col gap-8 p-8 sm:container text-white/80 md:w-2/3 self-center">
      <h3 className="font-bold drop-shadow-lg text-xl text-center self-center mt-12 z-1 nasa-font">Lesson planner</h3>

      <img src={starComet.src} alt="Star Comet image" className="w-[200px] absolute right-0 -translate-y-8 -z-10" />

      <section className="flex flex-col">
        <p>To help us create the perfect lesson plan tailored to your classroom, please provide the following details:</p>
        <br />
        <ul className="list-disc pl-8">
          <li>Number of students</li>
          <li>Age group of your students</li>
          <li>Technology access (Fullm, Limited, None)</li>
          <li>Goals and topic for the lesson</li>
          <li>Preferred learning style (Visual, Kinesthetic, Auditory)</li>
          <li>Desired lesson length</li>
        </ul>
        <br />
        <p>The more details your provide, the better we can customize an engaging and effective learning experience for your students!</p>
      </section>

      <div className="box-color-lesson rounded-2xl text-black">
        <h4 className="bg-[#F3B643] rounded-full py-2 px-4 font-bold">Tell us more about your lesson</h4>
        <textarea 
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="e.g. 25 students, ages 10-12, limited technology, introducing exoplanets, focus on visual learning, 45 minutes" 
          className="flex bg-transparent rounded-2xl h-64 w-full placeholder:text-black/80 p-4 resize-none"
        />
        <button 
        onClick={toggleListening} 
        className={`flex justify-center self-center bg-[#F3B643] p-2 rounded-bl-2xl rounded-tr-2xl ${isListening ? 'bg-red-500' : ''}`}
      >
        {isListening ? <MicOff /> : <Mic />}
      </button>
      </div>
      
      

      <button className="flex justify-center self-center btn-yellow w-56">Create lesson plan</button>

      <img src={spaceshipSmall.src} alt="spaceship small image" className="absolute -translate-y-8 translate-x-12 bottom-0 left-0 w-36 -z-10" />
      <img src={planetHoop.src} alt="planet hoop image" className="absolute -translate-y-4 -translate-x-8 right-0 bottom-0 w-[300px] -z-10" />
    </main>
  );
};

export default LessonPlanner;