import { Button } from "@blueprintjs/core";
import React from "react";
import { useTranslation } from "react-i18next";
import generateGUID from "../../../hooks/utils/generateGUID";
import { useSelectedColliderID } from "../../../hooks/jotai/useSelectedCollider";
import useSelectedElem from "../../../hooks/jotai/useSelectedElem";
import ColliderEditorPanel from "../editors/ColliderEditorPanel";
import DropdownList from "../util/DropdownList";
import MapError from "../util/MapError";
import PanelContainer from "../util/PanelContainer";

const BLACKLISTED_TYPES = [
    "util-dummy",
    "util-meeting",
    "util-triggerrepeat",
    "util-triggertimer",
    "util-triggerstart",
    "util-triggerrand",
    "util-minimap",
    "util-minimapsprite",
    "util-layer",
    "util-spawn1",
    "util-spawn2",
    "util-sabotages",
];

const SOLID_ONLY_TYPES = [
    "util-room",
    "util-sound1",
    "util-sound2",
    "util-tele",
    "util-triggerarea",
    "util-triggersound",
    "util-decontamination"
];

const SHADOW_ONLY_TYPES = [
    "util-onewaycollider"
];

const SINGULAR_TYPES = [
    "util-room",
    "util-sound2",
    "util-decontamination"
];

export default function ColliderPanel() {
    const { t } = useTranslation();
    const [selectedElem, setSelectedElem] = useSelectedElem();
    const [selectedColliderID, setSelectedColliderID] = useSelectedColliderID();

    const isSolidOnly = React.useMemo(() => {
        return SOLID_ONLY_TYPES.includes(selectedElem?.type || "");
    }, [selectedElem?.type]);

    const isShadowOnly = React.useMemo(() => {
        return SHADOW_ONLY_TYPES.includes(selectedElem?.type || "");
    }, [selectedElem?.type]);

    const isAddDisabled = React.useMemo(() => {
        return selectedElem
            && SINGULAR_TYPES.includes(selectedElem?.type)
            && selectedElem.properties.colliders
            && selectedElem.properties.colliders.length > 0;
    }, [selectedElem?.properties?.colliders]);

    const addCollider = React.useCallback(() => {
        if (!selectedElem)
            return;
        if (selectedElem.properties.colliders === undefined)
            selectedElem.properties.colliders = [];

        const collider = {
            id: generateGUID(),
            blocksLight: !isSolidOnly,
            isSolid: isSolidOnly,
            points: [
                { x: -0.5, y: 0.5 },
                { x: -0.5, y: -0.5 },
                { x: 0.5, y: -0.5 },
                { x: 0.5, y: 0.5 },
            ]
        };

        const elem = {
            ...selectedElem,
            properties: {
                ...selectedElem.properties,
                colliders: [
                    ...selectedElem.properties.colliders,
                    collider
                ]
            }
        };
        setSelectedElem(elem);
        setSelectedColliderID(collider?.id);
    }, [selectedElem, setSelectedElem, setSelectedColliderID, isSolidOnly]);

    if (!selectedElem || BLACKLISTED_TYPES.includes(selectedElem.type))
        return null;

    return (
        <>
            <PanelContainer title={t("collider.title") as string}>
                <Button
                    alignText="left"
                    minimal
                    fill
                    icon="add"
                    text={t("collider.add") as string}
                    onClick={addCollider}
                    disabled={isAddDisabled}
                    style={{ marginTop: 5, marginBottom: 0 }}
                />
                <DropdownList
                    elements={selectedElem.properties.colliders?.map((collider, index) => ({
                        id: collider.id,
                        name: collider.name !== undefined ? collider.name : t("collider.defaultName", { index: index + 1 }) as string,
                        intent: collider.blocksLight ? "danger" : "success",
                        icon: "edit"
                    })) ?? []}
                    selectedID={selectedColliderID}
                    onSelectID={setSelectedColliderID}
                    renderElement={(element) => (
                        <ColliderEditorPanel
                            key={element.id}
                            colliderID={element.id}
                            setSelectedColliderID={setSelectedColliderID}
                            isSolidOnly={isSolidOnly}
                            isShadowOnly={isShadowOnly}
                        />
                    )}
                />

            </PanelContainer>

            <MapError
                isVisible={selectedColliderID !== undefined}
                info
                icon="hand-up"
            >
                {t("collider.colliderInfo") as string}
            </MapError>
            <MapError
                isVisible={selectedElem.type.startsWith("sab-door")}
                info
                icon="polygon-filter"
            >
                {t("collider.doorInfo") as string}
            </MapError>
            <MapError
                isVisible={selectedElem.type === "util-room"}
                info
                icon="area-of-interest"
            >
                {t("collider.roomInfo") as string}
            </MapError>
            <MapError
                isVisible={selectedElem.type.startsWith("util-sound") || selectedElem.type === "util-triggersound"}
                info
                icon="volume-up"
            >
                {t("collider.soundInfo") as string}
            </MapError>
            <MapError
                isVisible={selectedElem.type === "util-triggerarea"}
                info
                icon="polygon-filter"
            >
                {t("collider.triggerAreaInfo") as string}
            </MapError>
            <MapError
                isVisible={selectedElem.type === "util-tele"}
                info
                icon="polygon-filter"
            >
                {t("collider.teleInfo") as string}
            </MapError>
            <MapError
                isVisible={selectedElem.type === "util-onewaycollider"}
                info
                icon="polygon-filter"
            >
                {t("collider.oneWayColliderInfo") as string}
            </MapError>
            <MapError
                isVisible={selectedElem.type === "util-decontamination"}
                info
                icon="volume-up"
            >
                {t("collider.soundInfo") as string}
            </MapError>
        </>
    );
}
