import React from "react";

const Component = (props) => {
    const { children, styles } = props;

    return (
        <>
            <div className="product-container">
                <div className={"product-list-full"} style={{ ...styles }}>
                    {children}
                </div>
            </div>
        </>
    )

}

export default Component;
