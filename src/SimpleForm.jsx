import React from 'react'
import {createFieldDefaultState, createFieldUpdateFunction, createFieldValidateFunction} from './validate'

export default class SimpleForm extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            name: createFieldDefaultState(''),
            age: createFieldDefaultState('')
        }
    }

    validateName = createFieldValidateFunction(this, 'name', () => !this.state.name.value && 'Missing name')
    setName = createFieldUpdateFunction(this, 'name', this.validateName)

    validateAge = createFieldValidateFunction(this, 'age', () => !this.state.age.value && 'We need to know your age because ... we do')
    setAge = createFieldUpdateFunction(this, 'age', this.validateAge)

    submit = (e) => {
        e.preventDefault()
        
        let valid = this.validateName() && this.validateAge()

        if(valid) {
            console.log('Submitting form ...')
        }

    }

    render() {

        return (
            <form>
                <h2>Simple form</h2>

                <div>
                    <label>Name:</label>
                    <input type="text"
                           value={this.state.name.value}
                           onChange={e => this.setName(e.target.value)}
                           onBlur={this.validateName}
                    />
                    <span>{this.state.name.errorMessage}</span>
                </div>

                <div>
                    <label>Age:</label>
                    <input type="number"
                           value={this.state.age.value}
                           onChange={e => this.setAge(e.target.value)}
                           onBlur={this.validateAge}
                    />
                    <span>{this.state.age.errorMessage}</span>
                </div>

                <button onClick={this.submit}>Submit</button>
            </form>
        )

    }

}
