import React, { Component } from "react";

class Items extends Component {
  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }
  state = {};
  render() {
    return (
      <div className="componentsContainer">
        {!this.props.addChildren && !this.props.removeChildren && (
          <React.Fragment>
            <div className="title">
              {["editBeds", "removeBeds"].includes(this.props.editState)
                ? "Beds"
                : ["addDoor", "removeDoor"].includes(this.props.editState)
                ? "Doors"
                : "Objects"}
            </div>
            {this.props.editState === "editBeds"
              ? this.editBedComponents()
              : this.props.editState === "removeBeds"
              ? this.removeBedsComponents()
              : this.props.editState === "addDoor"
              ? this.addDoorComponents()
              : this.props.editState === "removeDoor"
              ? this.removeDoorComponents()
              : this.props.editState === "addObject"
              ? this.addObjectComponents()
              : this.props.editState === "removeObject"
              ? this.removeObjectComponents()
              : this.normalSituationComponents()}
          </React.Fragment>
        )}
      </div>
    );
  }

  addObjectComponents = () => (
    <form action="" id="objectSizeForm">
      {!this.props.newObject ? (
        <React.Fragment>
          <div>
            Length: <input type="text" name="length" id="length" />
          </div>
          <div>
            Width: <input type="text" name="width" id="width" />
          </div>
          <div className="alterButtons">
            <input type="submit" value="Start" onClick={this.props.startAddingObjects} />
            <button
              onClick={async e => {
                e.preventDefault();
                await this.props.updateAppState("editState", "");
              }}>
              Stop
            </button>
          </div>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <div className="alterButtons">
            <button onClick={this.props.turnObjectSideways}>Turn Around</button>
            <button
              onClick={async e => {
                e.preventDefault();
                await this.props.updateAppState("newObject", null);
                await this.props.updateAppState("editState", "");
              }}>
              Stop Adding
            </button>
          </div>
          <div className="information">
            <div>Add an object by hovering over the bedroom.</div>
          </div>
        </React.Fragment>
      )}
    </form>
  );

  removeObjectComponents = () => (
    <React.Fragment>
      <div className="information">Click on the object you wish to remove</div>
      <button
        onClick={async e => {
          e.preventDefault();
          await this.props.updateAppState("editState", "");
        }}>
        Stop
      </button>
    </React.Fragment>
  );

  addDoorComponents = () => (
    <form action="" id="doorSizeForm">
      {!this.props.newDoor ? (
        <React.Fragment>
          <div>
            Length: <input type="text" name="length" id="length" />
          </div>
          <div className="alterButtons">
            <input type="submit" value="Start" onClick={this.props.startAddingDoors} />
            <button
              onClick={async e => {
                e.preventDefault();
                await this.props.updateAppState("editState", "");
              }}>
              Stop
            </button>
          </div>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <div className="alterButtons">
            <button
              onClick={async e => {
                e.preventDefault();
                await this.props.updateAppState("newDoor", null);
                await this.props.updateAppState("editState", "");
              }}>
              Stop Adding
            </button>
          </div>
          <div className="information">
            <div>Add a door by hovering over the walls of the bedroom.</div>
          </div>
        </React.Fragment>
      )}
    </form>
  );

  removeDoorComponents = () => (
    <React.Fragment>
      <div className="information">Click on the door you wish to remove</div>
      <button
        onClick={async e => {
          e.preventDefault();
          await this.props.updateAppState("editState", "");
        }}>
        Stop
      </button>
    </React.Fragment>
  );

  editBedComponents = () => (
    <form action="" id="bedSizeForm">
      <div>
        {!this.props.newBed ? (
          <React.Fragment>
            <div>
              Width: <input type="text" name="width" id="width" />{" "}
            </div>
            <div>
              Length: <input type="text" name="length" id="length" />
            </div>
            <div>
              <input type="checkbox" name="bunkbed" id="bunkbed" />
              Bunkbed
            </div>
            <div className="alterButtons">
              <input type="submit" value="Start" onClick={this.props.startAddingBeds} />
              <button
                onClick={async e => {
                  e.preventDefault();
                  await this.props.updateAppState("editState", "");
                }}>
                Stop
              </button>
            </div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div className="alterButtons">
              <button onClick={this.props.turnBedSideways}>Turn Around</button>
              <button
                onClick={async e => {
                  e.preventDefault();
                  await this.props.updateAppState("newBed", null);
                  await this.props.updateAppState("editState", "");
                }}>
                Stop Adding
              </button>
            </div>
            <div className="information">
              <div>Add a bed by hovering over the bedroom.</div>
            </div>
          </React.Fragment>
        )}
      </div>
    </form>
  );

  removeBedsComponents = () => (
    <React.Fragment>
      <div className="information">Click on the bed you wish to remove</div>
      <button
        onClick={async e => {
          e.preventDefault();
          await this.props.updateAppState("editState", "");
        }}>
        Stop
      </button>
    </React.Fragment>
  );

  normalSituationComponents = () => (
    <React.Fragment>
      <div className="subTitle">Beds</div>
      <div className="alterButtons">
        <button
          className="alterButton"
          onClick={async () => {
            await this.props.updateAppState("editState", "editBeds");
          }}>
          +
        </button>
        <button
          className="alterButton"
          onClick={async () => {
            await this.props.updateAppState("editState", "removeBeds");
          }}>
          -
        </button>
      </div>
      <div className="subTitle">Doors</div>
      <div className="alterButtons">
        <button
          className="alterButton"
          onClick={async () => {
            await this.props.updateAppState("editState", "addDoor");
          }}>
          +
        </button>
        <button
          className="alterButton"
          onClick={async () => {
            await this.props.updateAppState("editState", "removeDoor");
          }}>
          -
        </button>
      </div>
      <div className="subTitle">Objects</div>
      <div className="alterButtons">
        <button
          className="alterButton"
          onClick={async () => {
            await this.props.updateAppState("editState", "addObject");
          }}>
          +
        </button>
        <button
          className="alterButton"
          onClick={async () => {
            await this.props.updateAppState("editState", "removeObject");
          }}>
          -
        </button>
      </div>
    </React.Fragment>
  );
}

export default Items;
