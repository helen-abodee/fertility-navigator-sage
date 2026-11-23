import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import QuestionScreen from "../components/QuestionScreen";
import { questions } from "../lib/questions";

describe("QuestionScreen", () => {
  it("answers a single-choice question on tap", () => {
    const onAnswer = vi.fn();
    render(
      <QuestionScreen
        def={questions.stage}
        stepIndex={1}
        stepCount={9}
        onAnswer={onAnswer}
        onBack={null}
      />,
    );
    fireEvent.click(screen.getByText("I'm in treatment now"));
    expect(onAnswer).toHaveBeenCalledWith("in_treatment");
  });

  it("the entry triage offers a pressure-free 'just learning' lane", () => {
    render(
      <QuestionScreen def={questions.entry} stepIndex={0} stepCount={9} onAnswer={() => {}} onBack={null} />,
    );
    expect(screen.getByText("Just learning for now")).toBeInTheDocument();
    expect(screen.getByText("Before treatment starts")).toBeInTheDocument();
  });

  it("multi-select: picking a treatment clears 'not sure', and Continue submits the picks", () => {
    const onAnswer = vi.fn();
    render(
      <QuestionScreen
        def={questions.treatments}
        stepIndex={5}
        stepCount={9}
        onAnswer={onAnswer}
        onBack={null}
      />,
    );
    fireEvent.click(screen.getByText("I'm not sure yet"));
    fireEvent.click(screen.getByText("Chemotherapy"));
    fireEvent.click(screen.getByText("Radiation"));
    fireEvent.click(screen.getByText("Continue"));
    expect(onAnswer).toHaveBeenCalledWith(["chemo", "radiation"]);
  });

  it("skippable questions render a skip control and never block on empty input", () => {
    const onSkip = vi.fn();
    render(
      <QuestionScreen
        def={questions.age}
        stepIndex={2}
        stepCount={9}
        onAnswer={() => {}}
        onSkip={onSkip}
        onBack={() => {}}
      />,
    );
    fireEvent.click(screen.getByText("Skip this question"));
    expect(onSkip).toHaveBeenCalled();
  });

  it("shows the back button when onBack is provided", () => {
    render(
      <QuestionScreen def={questions.age} stepIndex={2} stepCount={9} onAnswer={() => {}} onBack={() => {}} />,
    );
    expect(screen.getByText("← Back")).toBeInTheDocument();
  });

  it("marks the ZIP question as optional", () => {
    render(
      <QuestionScreen def={questions.zip} stepIndex={8} stepCount={9} onAnswer={() => {}} onBack={() => {}} />,
    );
    expect(screen.getByText("optional")).toBeInTheDocument();
  });

  it("chemo medicines: picking a drug clears 'I don't know the names'", () => {
    const onAnswer = vi.fn();
    render(
      <QuestionScreen
        def={questions.chemo_drugs}
        stepIndex={6}
        stepCount={10}
        onAnswer={onAnswer}
        onBack={() => {}}
      />,
    );
    fireEvent.click(screen.getByText("I don't know the names"));
    fireEvent.click(screen.getByText("Cyclophosphamide (Cytoxan)"));
    fireEvent.click(screen.getByText("Continue"));
    expect(onAnswer).toHaveBeenCalledWith(["cyclophosphamide"]);
  });
});
