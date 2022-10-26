import { H5 } from "@blueprintjs/core";
import React from "react";
import { useSelectedElemValue } from "../../hooks/jotai/useSelectedElem";
import { useElementType } from "../../hooks/jotai/useTypes";
import { useSpriteType } from "../../hooks/useSprite";
import useTranslation from "../../hooks/useTranslation";
import AUElementDB from "../../types/au/AUElementDB";
import MapError from "./MapError";
import PanelContainer from "./PanelContainer";
import RoomSelect from "./RoomSelect";

export default function SabPanel() {
    const translation = useTranslation();
    const selectedElem = useSelectedElemValue();
    const [sabName, setSabName] = React.useState("");
    const sprite = useSpriteType(selectedElem?.type);
    const roomElems = useElementType("util-room");

    const parentRoom = roomElems.find((e) => e.id === selectedElem?.properties.parent);

    React.useEffect(() => {
        const auElement = AUElementDB.find((elem) => elem.type === selectedElem?.type);
        setSabName(auElement ? auElement.name : "Unknown");
    }, [selectedElem]);

    if (!selectedElem
        || !selectedElem.type.startsWith("sab-"))
        return null;

    return (
        <>
            <PanelContainer title={translation.Sabotage}>
                <div style={{ textAlign: "center", margin: 15 }}>
                    <img
                        style={{ maxHeight: 100, maxWidth: 100 }}
                        src={sprite?.src}
                        alt={selectedElem.name}
                    />
                    <H5 style={{ marginBottom: 3 }}>{sabName}</H5>
                    <p className="bp4-text-muted">{selectedElem.type}</p>
                </div>
                <RoomSelect useDefault={true} />
            </PanelContainer>

            <MapError isVisible={parentRoom === undefined}>
                This sabotage is not attached to a room.
            </MapError>
        </>
    );
}
