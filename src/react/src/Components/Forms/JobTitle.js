import React from 'react';
import { HiOutlinePencil, HiOutlineCheck, HiOutlineX} from 'react-icons/hi';
import EdiText from 'react-editext';

const EditButton = () => <React.Fragment><HiOutlinePencil style={{margin:'0 0.1rem 0.2rem 0'}} />Edit</React.Fragment>;
const SaveButton = () => <HiOutlineCheck/>;
const CancelButton = () => <HiOutlineX/>;

const JobTitle = ({formik}) => (
    <React.Fragment>
        <EdiText 
            type="text" 
            name="name"
            value={formik.values.name}
            viewProps={{className: 'h2'}}
            onSave={(value) => formik.setFieldValue('name', value)}
            hint="You can use letters, numbers, underscores, and hyphens."
            editButtonContent={<EditButton/>}
            editButtonClassName="edit-button"
            saveButtonContent={<SaveButton />}
            saveButtonClassName="save-button"
            cancelButtonContent={<CancelButton />}
            cancelButtonClassName="cancel-button"
            hideIcons
            editOnViewClick
            submitOnUnfocus
            submitOnEnter
        />
        {formik.errors.name && 
          <p className="text-danger small">
              {formik.errors.name}
          </p>}
        <EdiText 
            type="text" 
            name="description"
            value={formik.values.description}
            onSave={(value) => formik.setFieldValue('description', value)}
            editButtonContent={<EditButton/>}
            editButtonClassName="edit-button"
            saveButtonContent={<SaveButton />}
            saveButtonClassName="save-button"
            cancelButtonContent={<CancelButton />}
            cancelButtonClassName="cancel-button"
            hideIcons
            editOnViewClick
            submitOnUnfocus
            submitOnEnter
        />
    </React.Fragment>
);
export default JobTitle;
