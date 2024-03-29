import React from 'react';
import { useFormikContext } from 'formik';
import { HiOutlinePencil, HiOutlineCheck, HiOutlineX } from 'react-icons/hi';
import EdiText from 'react-editext';

const EditButton = () => <React.Fragment><HiOutlinePencil style={{margin:'0 0.1rem 0.2rem 0'}} />Edit</React.Fragment>;
const SaveButton = () => <HiOutlineCheck/>;
const CancelButton = () => <HiOutlineX/>;

const JobTitle = () => {
    const {values, setFieldValue, errors} = useFormikContext();
    return <React.Fragment>
        <EdiText 
            type="text" 
            name="name"
            value={values.name}
            viewProps={{className: 'h2'}}
            onSave={(value) => setFieldValue('name', value)}
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
        {errors.name && 
          <p className="text-danger small">
              {errors.name}
          </p>}
        <EdiText 
            type="text" 
            name="description"
            value={values.description}
            onSave={(value) => setFieldValue('description', value)}
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
    </React.Fragment>;
};
export default JobTitle;
