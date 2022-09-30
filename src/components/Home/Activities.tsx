import { FC } from "react";
import { H3, HorizontalDivider } from "@deskpro/app-sdk";
import {
    Title,
    TwoColumn,
    BaseContainer,
} from "../common";

const activities = [
    { id: 0, title: "Call Name", type: "Call", date: "15 Mar, 2021", link: "https://github.com/zpawn" },
    { id: 1, title: "Test Email", type: "Email", date: "15 Mar, 2021", link: "https://github.com/zpawn" },
];

type ActivityProps = {
    id: number,
    title: string,
    type: string,
    date: string,
    link: string,
};

const Activity: FC<ActivityProps> = ({ title, link, type, date }) => (
    <>
        <Title as={H3} title={title} link={link} marginBottom={7} />
        <TwoColumn
            leftLabel="Type"
            leftText={type}
            rightLabel="Date"
            rightText={date}
        />
        <HorizontalDivider style={{ marginBottom: 7 }}/>
    </>
);

const Activities: FC = () => (
    <BaseContainer>
        <Title title="Activities (2)" onClick={() => {}}/>
        {activities.map((activity) => (
            <Activity key={activity.id} {...activity} />
        ))}
    </BaseContainer>
);

export { Activities };