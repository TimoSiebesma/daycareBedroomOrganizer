import React, { Component } from "react";

class Children extends Component {
  state = {
    showChildren: false
  };

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }
  render() {
    return (
      <React.Fragment>
        {["", "addChildren", "removeChildren"].includes(this.props.editState) && (
          <div className="childrenSubContainer">
            <div className="title">Children</div>
            {this.props.editState === "addChildren"
              ? this.addChildren()
              : this.props.editState === "removeChildren"
              ? this.removeChildren()
              : this.normalConditions()}
          </div>
        )}
      </React.Fragment>
    );
  }

  normalConditions = () => (
    <React.Fragment>
      <div className="content">
        {this.props.user.children
          .filter(child => !child.inBed)
          .map(child => (
            <div key={"" + child.firstName + child.lastName} className="specButton">
              {child.firstName}
            </div>
          ))}
      </div>
      <div className="buttons">
        <button
          className="alterButton"
          onClick={async e => {
            e.preventDefault();
            await this.props.updateAppState("editState", "addChildren");
          }}>
          +
        </button>
        <button
          className="alterButton"
          onClick={async e => {
            e.preventDefault();
            await this.props.updateAppState("editState", "removeChildren");
          }}>
          -
        </button>
      </div>
    </React.Fragment>
  );

  addChildren = () => (
    <React.Fragment>
      <div className="content">
        {this.props.user.children
          .filter(child => !child.inBed)
          .map(child => (
            <div
              className={
                this.props.selectedChild === this.props.user.children.indexOf(child)
                  ? "specButtonSelected"
                  : "specButton"
              }
              onClick={async e => {
                e.preventDefault();
                await this.props.updateBedroomComponentState(
                  "selectedChild",
                  this.props.user.children.indexOf(child)
                );
              }}>
              {child.firstName}
            </div>
          ))}
      </div>

      <div className="buttons">
        <div className="information">
          <div>
            Click on the child you wish to select. Next, click on the bed you wish to assign the
            child to.
          </div>
        </div>
      </div>
      <button
        className="miniButtonRight"
        onClick={async e => {
          e.preventDefault();
          await this.props.updateAppState("editState", "");
          await this.props.updateBedroomComponentState("selectedChild", -1);
        }}>
        Back
      </button>
    </React.Fragment>
  );

  removeChildren = () => (
    <React.Fragment>
      <div className="content">
        {this.props.user.children
          .filter(child => !child.inBed)
          .map(child => (
            <div className="specButton">{child.firstName}</div>
          ))}
      </div>
      <div className="buttons">
        <div className="information">Click on a bed to remove its child</div>
      </div>
      <button
        className="miniButtonRight"
        onClick={async e => {
          e.preventDefault();
          await this.props.updateAppState("editState", "");
        }}>
        Back
      </button>
    </React.Fragment>
  );
}

export default Children;
