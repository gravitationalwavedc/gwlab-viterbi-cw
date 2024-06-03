import React from 'react';
import { useFormikContext } from 'formik';
import { HiOutlinePencil, HiOutlineCheck, HiOutlineX } from 'react-icons/hi';
import EdiText from 'react-editext';

const EditButton = () => <React.Fragment><HiOutlinePencil style={{margin:'0 0.1rem 0.2rem 0'}} />Edit</React.Fragment>;
const SaveButton = () => <HiOutlineCheck data-testid='saveButton'/>;
const CancelButton = () => <HiOutlineX/>;

const JobTitle = () => {
    const {values, setFieldValue, setFieldTouched, errors, touched} = useFormikContext();
    const showNameError = errors.name && touched.name;
    const showDescriptionError = errors.description && touched.description;
    const handleSave = (fieldName, value) => {
        setFieldValue(fieldName, value);
        setFieldTouched(fieldName);
    };
    return <React.Fragment>
        <EdiText 
            type="text" 
            name="name"
            value={values.name}
            viewProps={{className: 'h2'}}
            onSave={(value) => handleSave('name', value)}
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
        {
            showNameError && <p className="text-danger small" data-testid="nameError">
                {errors.name}
            </p>
        }
        <EdiText 
            type="text" 
            name="description"
            value={values.description}
            onSave={(value) => handleSave('description', value)}
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
        {
            showDescriptionError && <p className="text-danger small" data-testid="descriptionError">
                {errors.description}
            </p>
        }
    </React.Fragment>;
};
export default JobTitle;
