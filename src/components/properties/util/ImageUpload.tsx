import { Button, ButtonGroup, H6, Icon } from "@blueprintjs/core";
import React from "react";
import { useTranslation } from "react-i18next";
import openUploadDialog from "../../../hooks/utils/openUploadDialog";
import useToaster from "../../../hooks/useToaster";
import LIColor from "../../../types/li/LIColor";
import ColorPicker from "../../utils/ColorPicker";
import SizeTag from "../../utils/SizeTag";
import MapAsset from "../../../types/li/MapAssetDB";
import generateGUID from "../../../hooks/utils/generateGUID";
import GUID from "../../../types/generic/GUID";
import { useCreateMapAsset, useMapAssetValue } from "../../../hooks/jotai/useMapAssets";

interface ImageUploadProps {
    name: string;
    defaultSpriteURL: string;
    assetID?: GUID;
    onUpload: (asset: MapAsset) => void;
    onReset: () => void;

    color?: LIColor;
    defaultColor?: LIColor;
    onColorChange?: (color: LIColor) => void;
    onFinish?: () => void;
    showName?: boolean;
}

export default function ImageUpload(props: ImageUploadProps) {
    const { t } = useTranslation();
    const [isHovering, setIsHovering] = React.useState(false);
    const toaster = useToaster();
    const asset = useMapAssetValue(props.assetID);
    const createMapAsset = useCreateMapAsset();

    // Get the size of the sprite in bytes
    const spriteSize = React.useMemo(() => {
        return asset?.blob?.size ?? 0;
    }, [asset]);

    // Handle Upload
    const onUploadClick = React.useCallback(() => {
        openUploadDialog("image/*").then((blob) => {
            if (blob)
                props.onUpload(createMapAsset(blob));
        });
    }, [props.onUpload]);

    // Handle Drag & Drop
    const onFileDrop = React.useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsHovering(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.type.startsWith("image/")) {
                props.onUpload({
                    id: generateGUID(),
                    blob: file,
                    url: URL.createObjectURL(file),
                });
            } else {
                toaster.danger(t("sprite.errorInvalidType"));
            }
        }
    }, [props.onUpload]);

    return (
        <div
            onDragOver={(e) => {
                e.preventDefault();
                setIsHovering(true);
            }}
            onDragLeave={(e) => {
                e.preventDefault();
                setIsHovering(false);
            }}
            onDrop={onFileDrop}
        >
            {/* Title */}
            {props.showName && (
                <H6 style={{
                    marginTop: 2
                }}>
                    {props.name}
                </H6>
            )}

            {/* Image Preview */}
            <div style={{ textAlign: "center", padding: 15 }}>
                <img
                    style={{
                        maxHeight: 100,
                        maxWidth: 100
                    }}
                    src={asset?.url ?? props.defaultSpriteURL}
                    alt={props.name}
                />
            </div>

            {/* Size Tag */}
            <div style={{ textAlign: "center", marginBottom: 10 }}>
                <SizeTag
                    sizeBytes={spriteSize}
                    warningMsg={t("sprite.errorSize") as string}
                    okMsg={t("sprite.okSize") as string}
                />
            </div>

            {/* Buttons */}
            <ButtonGroup fill>
                <Button
                    icon="cloud-upload"
                    intent="primary"
                    onClick={() => onUploadClick()}
                    style={{ margin: 3 }}
                />
                {props.onColorChange ? (
                    <ColorPicker
                        intent="success"
                        color={props.color ?? props.defaultColor ?? { r: 255, g: 255, b: 255, a: 255 }}
                        style={{ margin: 3 }}
                        onChange={props.onColorChange}
                    />
                ) : (
                    <Button
                        icon="tick"
                        intent="success"
                        style={{ margin: 3 }}
                        disabled={!props.onFinish}
                        onClick={props.onFinish}
                    />
                )}

                <Button
                    icon="refresh"
                    intent="danger"
                    onClick={props.onReset}
                    style={{ margin: 3 }}
                    disabled={props.color === undefined && asset === undefined}
                />
            </ButtonGroup>

            {/* Drag & Drop File Upload */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 5,
                    right: 5,
                    bottom: 5,
                    borderRadius: 5,
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    opacity: isHovering ? 1 : 0,
                    transition: "opacity 0.1s",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    zIndex: 1000,
                    pointerEvents: "none",
                }}>

                <Icon
                    icon="cloud-upload"
                    size={40}
                    style={{ marginRight: 10 }}
                />
                <span style={{
                    fontSize: 20,
                    fontWeight: "bold",
                }}>
                    {t("sprite.upload")}
                </span>
                <span style={{
                    fontSize: 14,
                }}>
                    {props.name}
                </span>
            </div>
        </div>
    );
}
