import { ReactNode } from "react";

export type StepperProps = {
    steps : number;
    messages: string[];
    subMessages?: string[];
    is_complete: boolean;
    children: ReactNode;
    current_step: number;
    goToPrevStep: () => void;
    goToNextStep: () => void;
}

export type StepperIcons = {
    is_active : boolean;
    is_complete: boolean;
    step_number: number;
}