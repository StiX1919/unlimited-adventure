import React, {useState} from 'react'
import styled from 'styled-components'


function TestMap(props){
    let [data, setdata] = useState(['blue','red','green','yellow','purple','black','magenta','orange','light blue','pink'])


    let black = false
    let white = false


    return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            {
                data.map((item, j) => {
                    return (
                        <div style={{display: 'flex'}}>
                            {
                                data.map((item, i) => {
                                    if(j % 2 === 0){
                                        black = !black
                                    } else {
                                        white = !white
                                    }
                                    return (
                                        <StyleBox key={i} index={i} row={j} color={j % 2 === 0 ? black ? 'orange' : 'blue' : white ? 'blue' : 'orange'}></StyleBox>
                                    )
                                })
                            }
                        </div>
                    )
                })
            }
        
        </div>
    )
}

export default TestMap



const StyleBox = styled.div`

    position: relative;

    ${props => {
        let {index, row, color} = props
        let left = 10 - (index * 2)

        if(index < 5){
            return `
                border-bottom: ${30 + (row * 2)}px solid ${color};
                margin-right: ${20 - left + 2}px;
                width: ${20 + (row * 2) - left}px;
                border-left: ${left}px solid transparent
            `
        } else {
            return `
                border-top: ${30 + (row * 2)}px solid ${color};
                margin-right: ${20  - 2 + left}px;
                width: ${20 + (row * 2) + left}px;
                border-left: ${-left }px solid transparent
            `
        }
    }}

    ::after {
        ${props => {
            let {index, row, color} = props
            let right = 8 - (index * 2)
            if(index < 5){
                return `
                    position: absolute;
                    content: "";
                    border-top: ${30 + (row * 2)}px solid ${color};
                    margin-left: ${5 + index}px;
                    width: ${20 + (row * 2) - right}px;
                    border-right: ${right}px solid transparent
                    
                `
            } else {
                return `
                    position: absolute;
                    content: "";
                    border-bottom: ${30 + (row * 2)}px solid ${color};
                    margin-left: ${15 - index}px;
                    width: ${20 + (row * 2) + right}px;
                    border-right: ${Math.abs(right)}px solid transparent
                    margin-top: -${30 + (row * 2)}px;
                `
            }

        }}
    }
`