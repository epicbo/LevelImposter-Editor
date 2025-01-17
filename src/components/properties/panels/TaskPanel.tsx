import { H5 } from "@blueprintjs/core";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSelectedElemValue } from "../../../hooks/jotai/useSelectedElem";
import { useElementType } from "../../../hooks/jotai/useTypes";
import { useSpriteType } from "../../../hooks/useSprite";
import RoomSelect from "../input/RoomSelect";
import TaskTypeSelect from "../input/TaskTypeSelect";
import TextPanelInput from "../input/TextPanelInput";
import MapError from "../util/MapError";
import PanelContainer from "../util/PanelContainer";
import NumericPanelInput from "../input/NumericPanelInput";

export default function TaskPanel() {
    const { t } = useTranslation();
    const roomElems = useElementType("util-room");
    const taskElems = useElementType("task-");
    const selectedElem = useSelectedElemValue();
    const typeElems = useElementType(selectedElem?.type ?? "");
    const sprite = useSpriteType(selectedElem?.type);

    const parentRoom = React.useMemo(() => {
        return roomElems.find((e) => e.id === selectedElem?.properties.parent);
    }, [roomElems, selectedElem]);

    const taskName = React.useMemo(() => {
        return t(`au.${selectedElem?.type}`) || selectedElem?.name || "";
    }, [selectedElem]);

    const hasDuplicateTempTask = React.useMemo(() => {
        const tempTasks = taskElems.filter((e) => e.type.startsWith("task-temp"));
        const filteredTempTasks = tempTasks.filter((e) => e.properties.parent === selectedElem?.properties.parent);
        return filteredTempTasks.length > 1 && selectedElem?.type.startsWith("task-temp");
    }, [taskElems, selectedElem]);

    const towelCount = React.useMemo(() => {
        return taskElems.filter((e) => e.type.startsWith("task-towels") && e.type !== "task-towels1").length;
    }, [taskElems]);

    if (!selectedElem || !selectedElem.type.startsWith("task-"))
        return null;

    return (
        <>
            <PanelContainer title={t("task.title") as string}>
                <div style={{ textAlign: "center", padding: 15 }}>
                    <img
                        style={{ maxHeight: 100, maxWidth: 100 }}
                        src={sprite?.src}
                        alt={selectedElem.name}
                    />
                    <H5 style={{ marginBottom: 3 }}>{taskName}</H5>
                    <p className="bp4-text-muted">{selectedElem.type}</p>
                </div>
                <RoomSelect useDefault={true} />
                <TaskTypeSelect />
                <TextPanelInput
                    prop="description"
                    name={"task.description"}
                    icon={"comment"}
                />

                {selectedElem.type.startsWith("task-towels") && (
                    <NumericPanelInput
                        name={"task.towelPickupCount"}
                        prop={"towelPickupCount"}
                        icon={"numerical"}
                        defaultValue={Math.floor(towelCount / 2)}
                        min={0}
                        stepSize={1}
                        max={towelCount}
                    />
                )}
            </PanelContainer>

            <MapError
                isVisible={selectedElem.type === "task-fuel2" && typeElems.length === 1}
            >
                {t("task.errorNoFuel")}
            </MapError>
            <MapError
                isVisible={parentRoom === undefined}
                icon="map-marker"
            >
                {t("task.errorNoRoom")}
            </MapError>
            <MapError
                isVisible={hasDuplicateTempTask}
                icon="map-marker"
            >
                {t("task.errorTemp")}
            </MapError>
        </>
    );
}
