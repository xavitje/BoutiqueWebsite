'use client';

import { FloatingNav } from '@/components/navigation/FloatingNav';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const QUESTIONS = [
    {
        id: 1,
        question: "Wat voor type reis zoekt u?",
        type: 'visual',
        options: [
            { value: 'relaxation', label: 'Ontspanning', desc: 'Rust en wellness' },
            { value: 'adventure', label: 'Avontuur', desc: 'Actief en ontdekken' },
            { value: 'culture', label: 'Cultuur', desc: 'Steden en bezienswaardigheden' },
            { value: 'nature', label: 'Natuur', desc: 'Bergen, zee of platteland' },
        ],
    },
    {
        id: 2,
        question: 'Wanneer wilt u reizen?',
        type: 'text',
        placeholder: 'Bijv. zomer 2026, december vakantie, flexibel...',
    },
    {
        id: 3,
        question: 'Met hoeveel personen reist u?',
        type: 'number',
        placeholder: 'Aantal reizigers',
    },
    {
        id: 4,
        question: 'Wat is uw budget indicatie per persoon?',
        type: 'text',
        placeholder: 'Bijv. €1000-2000, €3000+, geen voorkeur...',
    },
    {
        id: 5,
        question: "Vertel ons meer over uw wensen",
        type: 'textarea',
        placeholder: 'Deel uw voorkeuren, speciale wensen, vieringen, of andere opmerkingen...',
    },
];

export default function JourneyBuilderPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<number, any>>({});
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const currentQuestion = QUESTIONS[currentStep];
    const progress = ((currentStep + 1) / QUESTIONS.length) * 100;

    const handleNext = async () => {
        if (currentStep < QUESTIONS.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            // Submit to API
            setSubmitting(true);
            setError('');

            try {
                const response = await fetch('/api/journey/submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        travelStyle: answers[1],
                        travelDate: answers[2],
                        guests: answers[3],
                        budget: answers[4],
                        preferences: answers[5],
                    }),
                });

                if (response.status === 401) {
                    window.location.href = '/login?callbackUrl=/journey-builder';
                    return;
                }

                if (!response.ok) {
                    throw new Error('Submission failed');
                }

                const data = await response.json();
                alert('✅ Uw reis aanvraag is succesvol ingediend! We nemen spoedig contact met u op.');

                // Reset form
                setAnswers({});
                setCurrentStep(0);
            } catch (err) {
                setError('Er is iets misgegaan. Probeer het opnieuw.');
            } finally {
                setSubmitting(false);
            }
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleAnswer = (value: any) => {
        setAnswers({ ...answers, [currentQuestion.id]: value });
    };

    return (
        <>
            <main className="page-container flex items-center justify-center section-padding">
                <div className="w-full max-w-4xl">
                    {/* Progress Bar */}
                    <div className="mb-12">
                        <div className="h-1 bg-charcoal/10 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-gold"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                        <p className="text-center text-sm text-charcoal/60 mt-2 font-mono">
                            Step {currentStep + 1} of {QUESTIONS.length}
                        </p>
                    </div>

                    {/* Question */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3 }}
                            className="min-h-[400px]"
                        >
                            <h1 className="text-3xl md:text-4xl font-serif text-center mb-12">
                                {currentQuestion.question}
                            </h1>

                            {/* Visual Choice */}
                            {currentQuestion.type === 'visual' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {currentQuestion.options?.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => handleAnswer(option.value)}
                                            className={`p-6 glass-effect rounded-sm text-left transition-all hover:scale-105 ${answers[currentQuestion.id] === option.value
                                                ? 'ring-2 ring-gold bg-gold/10'
                                                : ''
                                                }`}
                                        >
                                            <div className="aspect-video bg-charcoal/5 rounded-sm mb-4 flex items-center justify-center">
                                                <span className="text-4xl">{option.label[0]}</span>
                                            </div>
                                            <h3 className="font-serif text-lg mb-2">{option.label}</h3>
                                            <p className="text-sm text-charcoal/60">{option.desc}</p>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Text Input */}
                            {currentQuestion.type === 'text' && (
                                <input
                                    type="text"
                                    value={answers[currentQuestion.id] || ''}
                                    onChange={(e) => handleAnswer(e.target.value)}
                                    placeholder={currentQuestion.placeholder}
                                    className="w-full px-6 py-4 glass-effect rounded-sm text-center text-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                                />
                            )}

                            {/* Number Input */}
                            {currentQuestion.type === 'number' && (
                                <input
                                    type="number"
                                    min="1"
                                    value={answers[currentQuestion.id] || ''}
                                    onChange={(e) => handleAnswer(e.target.value)}
                                    placeholder={currentQuestion.placeholder}
                                    className="w-full px-6 py-4 glass-effect rounded-sm text-center text-lg focus:outline-none focus:ring-2 focus:ring-gold/50"
                                />
                            )}

                            {/* Textarea */}
                            {currentQuestion.type === 'textarea' && (
                                <textarea
                                    value={answers[currentQuestion.id] || ''}
                                    onChange={(e) => handleAnswer(e.target.value)}
                                    placeholder={currentQuestion.placeholder}
                                    rows={6}
                                    className="w-full px-6 py-4 glass-effect rounded-sm text-lg focus:outline-none focus:ring-2 focus:ring-gold/50 resize-none"
                                />
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation */}
                    <div className="flex justify-between mt-12">
                        <MagneticButton
                            onClick={handleBack}
                            disabled={submitting}
                            className={`btn-secondary flex items-center gap-2 ${currentStep === 0 ? 'invisible' : ''
                                }`}
                        >
                            <ChevronLeft size={20} />
                            <span>Terug</span>
                        </MagneticButton>

                        <MagneticButton
                            onClick={handleNext}
                            disabled={submitting}
                            className="btn-primary flex items-center gap-2"
                        >
                            <span>{submitting ? 'Bezig...' : currentStep === QUESTIONS.length - 1 ? 'Versturen' : 'Volgende'}</span>
                            <ChevronRight size={20} />
                        </MagneticButton>
                    </div>

                    {error && (
                        <p className="text-center text-red-600 mt-4">{error}</p>
                    )}
                </div>
            </main>

            <FloatingNav />
        </>
    );
}
