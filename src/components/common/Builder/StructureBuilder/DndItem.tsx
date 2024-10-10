import styled from "styled-components";
import { useDrag, useDrop } from "react-dnd";
import { P5, IconV2, Button } from "@deskpro/deskpro-ui";
import { DndTypes } from "../../../../constants";
import type { FC } from "react";
import type { DragItem } from "./types";

type Props = {
  item: string;
  index: number;
  rowIndex: number;
  onMoveWithinRow: (rowIndex: number, draggedIndex: number, hoverIndex: number) => void;
  onDeleteItem: (rowIndex: number, itemIndex: number) => void;
};

const DndItemStyled = styled.div`
    box-sizing: border-box;
    display: flex;
    gap: 6px;
    justify-content: space-between;
    align-items: center;
    margin-left: 6px;
    border: 1px solid ${({ theme }) => theme.colors.brandShade50};
    border-radius: 4px;
    background-color: ${({ theme }) => theme.colors.white};
    cursor: move;

    .dnd-item-0 {
      margin-left: 0;
    }
`;

const DndItemLabel = styled(P5)`
    flex-grow: 1;
`;

const DndItem: FC<Props> = ({ item, index, onMoveWithinRow, rowIndex, onDeleteItem }) => {
    const [, ref] = useDrag({
      type: `item-${DndTypes.CONTACT}`,
      item: { index, rowIndex },
    });
  
    const [, drop] = useDrop<DragItem>({
      accept: `item-${DndTypes.CONTACT}`,
      hover: (draggedItem) => {
        if (draggedItem.rowIndex === rowIndex && draggedItem.index !== index) {
            onMoveWithinRow(rowIndex, draggedItem.index, index);
            draggedItem.index = index;
        }
      },
    });
  
    return (
      <DndItemStyled id="dnd-item" ref={(node) => ref(drop(node))} style={{ marginLeft: index === 0 ? "0" : "6px" }}>
        <IconV2 icon="dp-custom-solid-grip-vertical" themeColor="grey40" size={14}/>
        <DndItemLabel type="p_p3">{item}</DndItemLabel>
        <Button
          type="button"
          intent="minimal"
          icon={<IconV2 icon="heroicons-solid-trash" size={14} themeColor="grey40"/>}
          onClick={() => onDeleteItem(rowIndex, index)}
        />
      </DndItemStyled>
    );
};

export { DndItem };
