import { Divider, FormGroup, H5, NumericInput, Switch } from "@blueprintjs/core";
import useSelectedElem from "../../hooks/jotai/useSelectedElem";

export default function ConsolePanel() {
    const [selectedElem, setSelectedElem] = useSelectedElem();

    const isConsole = selectedElem?.type.startsWith("task-")
        || selectedElem?.type.startsWith("sab-")
        || selectedElem?.type.startsWith("util-button")
        || selectedElem?.type.startsWith("util-cams")
        || selectedElem?.type === "util-admin"
        || selectedElem?.type === "util-vitals"
        || selectedElem?.type === "util-computer";

    if (!selectedElem || !isConsole)
        return null;

    return (
        <div className="console-panel">
            <H5 style={{ marginTop: 25 }}>Console</H5>
            <Divider />
            <FormGroup>
                <NumericInput
                    fill
                    placeholder="Range"
                    value={selectedElem.properties.range === undefined ? 1 : selectedElem.properties.range}
                    min={0}
                    minorStepSize={0.1}
                    stepSize={0.5}
                    majorStepSize={1}
                    leftIcon="circle"
                    onValueChange={(val) => {
                        setSelectedElem({ ...selectedElem, properties: { ...selectedElem.properties, range: val } });
                    }}
                />
                <Switch
                    checked={selectedElem.properties.onlyFromBelow}
                    label="Only from Below"
                    onChange={(e) => {
                        setSelectedElem({ ...selectedElem, properties: { ...selectedElem.properties, onlyFromBelow: e.currentTarget.checked } });
                    }}
                />
            </FormGroup>
        </div>
    );
}