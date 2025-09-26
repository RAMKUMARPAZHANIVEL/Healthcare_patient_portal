import React from "react";
import { Box, Button } from '@mui/material';

const Component = (props) => {

    const { page, pageSize, rowCount, onPageChange } = props;
 
    const handlePageChange = (newPage) => {
        onPageChange(newPage);
    };
    
    return (
        <Box
        sx={{ display: 'flex', justifyContent: 'center', gap: 1.5, my: 2, alignItems: 'center', width: "100%" }}
        >
        <Button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 0}
                sx={{ 
                textTransform: 'none', fontSize: '12px', color: page === 0 ? '#aaa' : 'primary.main', bgcolor: 'transparent', minWidth: 'auto', borderRadius: "8px",         
                '&:hover': {
                    color: '#fff',
                    bgcolor: 'primary.main'
                },
                }}
            >
            Previous
        </Button>
    
        {Array.from({ length: Math.ceil(rowCount/pageSize) })
        .slice(0, 5)
        .map((_, i) => (
            <Button
            key={i}
            onClick={() => handlePageChange(i)}
            sx={{ 
                width: 32, height: 32, minWidth: 0, padding: 0, fontSize: '12', borderRadius: '8px', fontWeight: 500,
                backgroundColor: page === i ? 'primary.main' : '#e0e0e0',
                color: page === i ? '#fff' : '#333',
                '&:hover': {
                backgroundColor: page === i ? 'primary.main' : '#d5d5d5',
                },
            }}
            >
            {i + 1}
            </Button>
        ))}
    
        <Button
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= Math.ceil(rowCount/pageSize) - 1}
                sx={{ 
                textTransform: 'none', fontSize: '12px', color: page >= pageSize - 1 ? '#aaa' : 'primary.main', bgcolor: 'transparent', minWidth: 'auto', borderRadius: "8px",
                '&:hover': {
                    color: 'secondary.main',
                    bgcolor: 'primary.main'
                },
                }}
            >
            Next
        </Button>
        </Box>
    );
}

export default Component;