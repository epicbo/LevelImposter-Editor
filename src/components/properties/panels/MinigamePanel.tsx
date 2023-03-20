import React from "react";
import { useTranslation } from "react-i18next";
import { useSelectedElemValue } from "../../../hooks/jotai/useSelectedElem";
import AUMinigameDB from "../../../types/au/AUMinigameDB";
import MinigameEditorPanel from "../editors/MinigameEditorPanel";
import DropdownList from "../util/DropdownList";
import MapError from "../util/MapError";
import PanelContainer from "../util/PanelContainer";

export default function MinigamePanel() {
    const { t } = useTranslation();
    const element = useSelectedElemValue();
    const [selectedMinigameType, setSelectedMinigameType] = React.useState<string | undefined>(undefined);

    const minigameSprites = React.useMemo(() => AUMinigameDB.filter((mg) => mg.split("_")[0] === element?.type), [element]);

    if (!element || minigameSprites.length === 0)
        return null;

    return (
        <>
            <PanelContainer title={t("minigame.title") as string}>
                <DropdownList
                    elements={minigameSprites.map((type) => ({
                        id: type,
                        name: t(`minigame.${type.split("_")[1]}`) as string,
                        icon: 'code-block',
                        intent: element.properties.minigames?.find((m) => m.type === type)?.spriteData ? 'success' : 'danger'
                    }))}
                    selectedID={selectedMinigameType}
                    onSelectID={setSelectedMinigameType}
                    renderElement={(mg) => (
                        <MinigameEditorPanel
                            key={mg.id}
                            minigameType={mg.id}
                            setSelectedMinigameType={setSelectedMinigameType}
                        />
                    )}
                />
            </PanelContainer>
            <MapError info>
                {t("minigame.saveInfo")}
            </MapError>
        </>
    );
}
