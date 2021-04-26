function extendedClassname(className, props) {
    return `${className} ${props.className || ""}`;
}

export { extendedClassname };
