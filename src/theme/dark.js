import createTheme from '@mui/material/styles/createTheme';

const theme = createTheme({
    palette: {
        mode: "dark",
        background: {
            paper: '#252631',
            surface: "#D9D9D9"
        },
        primary: { main: "#607D8B" },
        secondary: { main: "#fff" }
    },
    customtableheader: {
        width: '100%', backgroundColor: "#252631",
        borderTop: "1px solid rgba(81, 81, 81, 1)",
        borderLeft: "1px solid rgba(81, 81, 81, 1)",
        borderRight: "1px solid rgba(81, 81, 81, 1)",
        borderRadius: "3px !important",
        color: "#fff"
    },
    typography: {
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        caption: {
            fontSize: "0.8rem",
        },
        colorcaption: {
            fontSize: "0.8rem",
            color: "grey"
        },
        avatar: {
            fontSize: "1rem",
            fontWeight: 'bold'
        },
        header: {
            fontSize: "1rem",
            fontWeight: 'bold'
        },
        subheader: {
            fontSize: "1.5rem",
            fontWeight: 'bold',
            margin: "5px 0px 5px 0px",
            color: "#fff"
        },
        subheadercenter: {
            fontSize: "1rem",
            fontWeight: 'bold',
            padding: "5px",
            display: "block",
        },
        cardheader: {
            fontSize: "1rem",
            fontWeight: 'bold'
        },
        labelheader: {
            fontSize: "0.875rem",
            fontWeight: "500",
            width: "100%",
            textAlign: "left",
            color: "#fff"
        },
        h6: {
            fontSize: "1.15rem",
        },
        mandatory: {
            marginLeft: 1,
            color: "rgb(211, 47, 47)"
        },
        notstarted: {
            backgroundColor: "#5E696E",
            color: "#ffffff",
            borderRadius: 5,
            padding: 3
        },
        started: {
            backgroundColor: "#E78C07",
            color: "#ffffff",
            borderRadius: 5,
            padding: 3
        },
        pending: {
            backgroundColor: "#BB0000",
            color: "#ffffff",
            borderRadius: 5,
            padding: 3
        },
        completed: {
            backgroundColor: "#2B7D2B",
            color: "#ffffff",
            borderRadius: 5,
            padding: 3
        },
        inputView: {
           border: "1px solid #9E9E9E",
           borderRadius: "8px",
           padding: "10px 20px",
           backgroundColor: "#9E9E9E",
           color: "#000",
           fontSize: "14px",
           fontWeight: 500,
           minHeight: "42px",
           marginTop: "12px",
           display: "block"
        }
    },
    select: {
        fontSize: "0.8rem",
        height: 21
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": {
                            borderWidth: "1px",
                            // borderColor: "rgba(0, 0, 0, 0.23)" // default color
                            borderColor: "rgba(0, 0, 0, 0.87)"
                        },
                        "&.Mui-error fieldset": {
                            borderWidth: "1px",
                            borderColor: "rgb(211, 47, 47)",
                        }
                    },
                    "& .MuiFormHelperText-root": {
                        marginLeft: "2px"
                    }
                }
            }
        },
        MuiDataGrid: {
            styleOverrides: {
                root: {
                    backgroundColor: "#252631",
                    "& .even": {
                        backgroundColor: '#121212',
                    }
                }
            }
        },
        MuiCardMedia: {
            styleOverrides: {
                root: {
                    backgroundColor: "#252631",
                    color: "#000"
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    boxShadow: "none",
                    borderRadius : "8px",
                    fontSize: "12px",
                    fontWeight: "700",
                    textTransform: "unset"
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    backgroundColor: '#252631',
                    borderRadius: '8px',                   
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#9E9E9E',
                        padding: "14px"
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'secondary.main',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'secondary.main', 
                    },
                },
                input: {
                    padding: '8.5px 14px',
                    color: "#fff",
                    fontSize: "14px",
                    fontWeight: "500"
                },
            },
        },
        MuiFormControl: {
            styleOverrides: {
                root: {
                    width: '100%',
                    maxWidth: '400px',
                    marginTop: '10px'
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                colorPrimary: {
                    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.12)',
                }
            }
        },
    },
    searchIconBorder: "1px solid rgba(0, 0, 0, 0.23)",
    childAddIconBorder: "1px solid rgba(0, 0, 0, 0.23)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.23)",
    borderBottomFocus: "1px solid rgba(0, 0, 0, 0.87)",
    borderBottomFocus2: "1px solid rgba(255, 255, 255, 0.87)"
});


export default theme;