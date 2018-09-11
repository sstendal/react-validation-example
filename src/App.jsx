import React, {Component} from 'react';
import ComplexForm from './ComplexForm'
import SimpleForm from './SimpleForm'

class App extends Component {
    
    render() {
        return (
            <div>
                <header>
                    <h1>React Validation Example</h1>
                </header>

                <SimpleForm/>

                <ComplexForm/>
            </div>
        );
    }
}

export default App;
