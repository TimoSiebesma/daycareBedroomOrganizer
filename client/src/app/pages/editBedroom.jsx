import React, { Component } from "react";
import BedroomCreator from "./bedroom/bedroomCreator";
import BedroomComponent from "./bedroom/bedroomComponent";

class EditBedroom extends Component {
  async componentDidMount() {
    let { selectedBedroom, user } = this.props;

    if (selectedBedroom > -1) {
      await this.setState({
        bedroom: user.bedrooms[selectedBedroom],
        askAboutDimensions: false
      });
    } else {
      await this.setState({ askAboutDimensions: true });
    }
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  state = {
    bedroom: null,
    askAboutDimensions: true,
    scrollIndex: 1
  };

  render() {
    let { updateAppState, user, selectedBedroom } = this.props;
    return (
      <React.Fragment>
        {this.state.askAboutDimensions ? (
          <BedroomCreator
            updateAppState={updateAppState}
            updateEditBedroomState={this.updateEditBedroomState}
            user={user}
            selectedBedroom={selectedBedroom}
          />
        ) : (
          <BedroomComponent
            updateAppState={updateAppState}
            updateEditBedroomState={this.updateEditBedroomState}
            user={user}
            selectedBedroom={selectedBedroom}
            bedroom={this.state.bedroom}
            editState={this.props.editState}
            newBed={this.props.newBed}
            newDoor={this.props.newDoor}
            newObject={this.props.newObject}
          />
        )}
      </React.Fragment>
    );
  }

  updateEditBedroomState = async (key, become) => {
    await this.setState({ [key]: become });
  };

  updateWindowDimensions = async () => {};
}

export default EditBedroom;
