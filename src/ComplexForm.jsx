import React from 'react'
import {createFieldDefaultState, createFieldUpdateFunction, createFieldValidateFunction} from './validate'

export default class ComplexForm extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            name: createFieldDefaultState(''),
            age: createFieldDefaultState(''),
            birthDate: createFieldDefaultState(''),
            fruits: createFieldDefaultState([])
        }
    }

    validateName = createFieldValidateFunction(this, 'name', ({isEditing}) => {
        if (!this.state.name.value) {
            return 'Missing name'
        }
        if (this.state.name.value.length > 0 && this.state.name.value[0] !== this.state.name.value[0].toLocaleUpperCase()) {
            return 'First character should be uppercase'
        }
        if (!isEditing) {
            if (this.state.name.value.length < 2) {
                return 'A name must be at least two characters'
            }
        }
    })
    setName = createFieldUpdateFunction(this, 'name', this.validateName)

    validateAge = createFieldValidateFunction(this, 'age', ({isEditing}) => {
        if (!this.state.age.value) {
            return 'We need to know your age because ... we do'
        }
        if(this.state.age.value < 0) {
            return 'Back from the future?'
        }
        if(!isEditing) {
            if (this.state.age.value < 13) {
                return 'We are sorry, but this form is only for grown ups. Please come back in ' + (13 - this.state.age.value) + ' years'
            }

            // Validates birth date again, since age may have been updated and birthdate's validation depends on this
            this.validateBirthDate()
        }
    })
    setAge = createFieldUpdateFunction(this, 'age', this.validateAge)

    validateBirthDate = createFieldValidateFunction(this, 'birthDate', ({isEditing}) => {
        if (!this.state.birthDate.value && this.state.age.value && this.state.age.value < 18) {
            return 'You must tell us your birth date if you are below 18'
        }
        if(!isEditing && this.state.birthDate.value) {
            let date = Date.parse(this.state.birthDate.value)
            if(isNaN(date)) {
                return 'Please write your birth date on the format yyyy-mm-dd. I.e. 1955-02-24'
            }
            let calculatedAge = calculateAge(new Date(date))
            if(!this.state.age.value) {
                this.setAge(calculatedAge)  // Set age if it is empty
            } else if (calculatedAge !== parseInt(this.state.age.value, 10)) {
                return 'This date does not match your age'
            }
        }
    })
    setBirthDate = createFieldUpdateFunction(this, 'birthDate', this.validateBirthDate)

    validateFruits = createFieldValidateFunction(this, 'fruits', () => this.state.fruits.value.length === 0 && 'You must select at least one fruit')
    setFruit = createFieldUpdateFunction(this, 'fruits', this.validateFruits)

    submit = (e) => {
        e.preventDefault()

        let validateAge = this.validateAge()
        let validateBirthDate = this.validateBirthDate()
        let validateName = this.validateName()
        let validateFruits = this.validateFruits()

        if(validateName && validateAge && validateBirthDate && validateFruits) {
            console.log('Submitting form ...')
        }

    }

    render() {

        return (
            <form>
                <h2>Complex form</h2>

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

                <div>
                    <label>Birth date:</label>
                    <input type="text"
                           placeholder="yyyy-mm-dd"
                           value={this.state.birthDate.value}
                           onChange={e => this.setBirthDate(e.target.value)}
                           onBlur={this.validateBirthDate}
                    />
                    <span>{this.state.birthDate.errorMessage}</span>
                </div>

                <div>
                    <label>Fruits:</label>
                    <ul>
                        <li>
                            <input type="checkbox" checked={this.state.fruits.value.includes('apple')}
                                   onChange={e => this.setFruit('apple', e.target.checked)}/> Apple
                        </li>
                        <li>
                            <input type="checkbox" checked={this.state.fruits.value.includes('orange')}
                                   onChange={e => this.setFruit('orange', e.target.checked)}/> Orange
                        </li>
                    </ul>
                    <span>{this.state.fruits.errorMessage}</span>
                </div>

                <button onClick={this.submit}>Submit</button>
            </form>
        )

    }

}


function calculateAge(birthDay) {
    return Math.abs(new Date(Date.now() - birthDay.getTime()).getUTCFullYear() - 1970);
}