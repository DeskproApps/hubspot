import { FC } from "react";
import { InputWithDisplay } from "@deskpro/deskpro-ui";
import { Stack } from "@deskpro/app-sdk";
import {
    Label,
    Button,
    SingleSelect,
} from "../common";
import type { Props } from "./types";

const ContactForm: FC<Props> = ({ onSubmit, onCancel, isEditMode = false }) => {
    return (
        <form onSubmit={onSubmit}>
            <Label htmlFor="email" label="Email">
                <InputWithDisplay
                    type="text"
                    id="email"
                    inputsize="small"
                    placeholder="Enter value"
                />
            </Label>

            <Label htmlFor="firstName" label="First name">
                <InputWithDisplay
                    type="text"
                    id="firstName"
                    inputsize="small"
                    placeholder="Enter value"
                />
            </Label>

            <Label htmlFor="lastName" label="Last name">
                <InputWithDisplay
                    type="text"
                    id="lastName"
                    inputsize="small"
                    placeholder="Enter value"
                />
            </Label>

            <Label htmlFor="owner" label="Contact owner">
                <SingleSelect
                    id="owner"
                    showInternalSearch
                    value={{ key: 0, value: 0, label: "No owner", type: "value" }}
                    options={[
                        { key: 0, value: 0, label: "No owner", type: "value" },
                        { key: 1, value: 1, label: "ilia makarov", type: "value" },
                    ]}
                />
            </Label>

            <Label htmlFor="jobTitle" label="Job title">
                <InputWithDisplay
                    type="text"
                    id="jobTitle"
                    inputsize="small"
                    placeholder="Enter value"
                />
            </Label>

            <Label htmlFor="phone" label="jobTitle">
                <InputWithDisplay
                    type="text"
                    id="phone"
                    inputsize="small"
                    placeholder="Enter value"
                />
            </Label>

            <Label htmlFor="lifecycleStage" label="Lifecycle stage">
                <SingleSelect
                    id="lifecycleStage"
                    showInternalSearch
                    options={[
                        { key: 0, value: 0, label: "Stage 1", type: "value" },
                        { key: 1, value: 1, label: "Stage 2", type: "value" },
                    ]}
                />
            </Label>

            <Label htmlFor="leadStatus" label="Lead status">
                <SingleSelect
                    id="leadStatus"
                    showInternalSearch
                    options={[
                        { key: 0, value: 0, label: "Status 1", type: "value" },
                        { key: 1, value: 1, label: "Status 2", type: "value" },
                    ]}
                />
            </Label>

            <Stack justify="space-between">
                <Button
                    type="submit"
                    text={isEditMode ? "Save" : "Create"}
                    disabled={false/*isSubmitting*/}
                    loading={false/*isSubmitting*/}
                />
                <Button
                    text="Cancel"
                    intent="tertiary"
                    onClick={onCancel}
                />
            </Stack>
        </form>
    );
};

export { ContactForm };
