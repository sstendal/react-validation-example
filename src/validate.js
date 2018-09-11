/*

    The functions in this file creates or modifies an object for use in component state

    The object has four fields that describes a state attribute:

        - value         The value of the attribute
        - valid         False if the value failed last validation
        - errorMessage  An error message if the value failed last validation
        - touched       True if the value has been touched

*/


/*
    Creates an object with fields for use in component state

    Example:

        constructor(props) {
            super(props)
            this.state = {
                name: createFieldDefaultState(props.name),
                hasAcceptedSomething: createFieldDefaultState(false)
            }
        }

    @param defaultValue The default value to store in the value sub-field
    @returns {{value: *, errorMessage: boolean, valid: boolean, touched: boolean}}
 */
export function createFieldDefaultState(defaultValue) {
    return {
        value: defaultValue,
        errorMessage: false,
        valid: true,
        touched: false
    }
}

/*
    Updates the errorMessage field in component state

    @param component The component with state
    @param fieldName The name of the field in state
    @param errorMessage The error message
 */
export function setFieldErrorMessage(component, fieldName, errorMessage) {
    if (!component.state[fieldName]) throw Error(`Field ${fieldName} does not exist in component state`)
    component.setState({
        [fieldName]: {
            value: component.state[fieldName].value,
            errorMessage: errorMessage,
            valid: !errorMessage,
            touched: component.state[fieldName].touched
        }
    })

}

/*
    Creates a validation function that updates the fields 'touched', 'valid' and 'errorMessage' in state

    The errorMessage parameter must be a function that validates the field as it is in state and returns an
    error message or nothing.

    The errorMessage function will receive a parameter {isEditing: true} if the function is called while the user
    is editing the value. The function may use this to relax validation for incomplete values.

    Example:

        validateDate = createValidateFunction(this, 'date', ({isEditing}) => {
            if(!this.state.date) return 'Missing date'
            if(!isEditing && !isNaN(Date.parse(this.state.date))) return 'Invalid date'
        })

    @param component The component with state
    @param fieldName The name of the field in state
    @param errorMessageFunction A function that returns an error message if the field has errors
    @param setStateCallback An optional function that will run after the state is updated
    @returns {boolean}
 */
export function createFieldValidateFunction(component, fieldName, errorMessageFunction, setStateCallback) {
    return ({setStateCallback: setStateCallback2, isEditing} = {isEditing: false}) => {
        if (!component.state[fieldName]) throw Error(`Field ${fieldName} does not exist in component state`)

        const errorMessage = errorMessageFunction({isEditing: isEditing})
        component.setState({
            [fieldName]: {
                value: component.state[fieldName].value,
                errorMessage: !errorMessage ? false : errorMessage,
                valid: !errorMessage,
                touched: true
            }
        }, () => {
            setStateCallback && setStateCallback()
            setStateCallback2 && setStateCallback2()
        })
        return !errorMessage
    }
}




/*
    Creates an update function that modifies a field in state.

    Example:

        // Creates a validate function that validates the field
        validateName = createFieldValidateFunction( ... )

        // Creates the update function
        setName = createFieldUpdateFunction(this, 'name', this.validateName)

        // Uses the update function directly. The validator will be called and the fields 'touched', 'valid'
        // and 'errorMessage' flags will be set accordingly
        this.setName('Jon Doe')

        // Uses the update function from an input field
        <input ... value={e => this.setName(e.target.name)} />

    @param component The component with state
    @param fieldName The name of the field in state
    @param validateFunction A validation function that returns an error message or nothing
    @param setStateCallback An optional function that will run after the state is updated
    @returns {Function}
 */
export function createFieldUpdateFunction(component, fieldName, validateFunction, setStateCallback) {
    return newValue => {
        if (!component.state[fieldName]) throw Error(`Field ${fieldName} does not exist in component state`)

        const newState = {
            [fieldName]: {
                value: newValue,
                errorMessage: component.state[fieldName].errorMessage,
                valid: component.state[fieldName].valid,
                touched: component.state[fieldName].touched || (component.state[fieldName].value !== newValue)
            }
        }
        component.setState(newState, () => {
            if (component.state[fieldName].touched) {
                if (validateFunction) {
                    validateFunction({setStateCallback, isEditing: true})
                } else if (setStateCallback) {
                    setStateCallback()
                }
            }
        })
    }
}

