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

  it("always offers a 'not sure' style answer on the stage question", () => {
    render(
      <QuestionScreen def={questions.stage} stepIndex={1} stepCount={9} onAnswer={() => {}} onBack={null} />,
    );
    expect(screen.getByText("I'm not sure")).toBeInTheDocument();
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

  it("shows the privacy line on every screen", () => {
    render(
      <QuestionScreen def={questions.zip} stepIndex={8} stepCount={9} onAnswer={() => {}} onBack={() => {}} />,
    );
    expect(screen.getByText("Your answers never leave this device.")).toBeInTheDocument();
  });
});
