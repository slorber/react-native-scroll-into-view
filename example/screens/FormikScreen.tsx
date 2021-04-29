import React from 'react';
import {
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { ScrollIntoView } from '../../src';
import {
  Button,
  Centered,
  ScrollIntoViewScrollView,
} from '../components/Components';
import { range, mapValues, keyBy } from 'lodash';
import { StringSchema } from 'yup';

type Field = {
  id: string;
  label: string;
  required: boolean;
  initialValue: string;
  validator: StringSchema;
};

// We generate some random form fields
const Fields: Field[] = range(0, 15).map(i => {
  const required = i % 3 === 1;
  //const initialValue = i % 5 === 0 ? 'prefilled value ' + i : '';
  const initialValue = '';
  const validator = required
    ? Yup.string()
        .min(4, 'Field is too short')
        .required('Field is required')
    : Yup.string();

  return {
    id: 'field_' + i,
    label: 'Field ' + i,
    required,
    initialValue,
    validator,
  };
});

const FieldInitialValues = mapValues(
  keyBy(Fields, f => f.id),
  f => f.initialValue,
);

const ValidationSchema = () => {
  const fieldsValidators = mapValues(
    keyBy(Fields, f => f.id),
    f => f.validator,
  );
  return Yup.object().shape(fieldsValidators);
};

const FormField = ({
  style,
  field,
  error,
  ...props
}: React.ComponentProps<typeof TextInput> & {
  field: Field;
  error?: string;
}) => (
  <View style={style}>
    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
      <Text>{field.label}</Text>
      {field.required && <Text style={{ color: 'red' }}>{' \u25CF'}</Text>}
    </Text>
    <TextInput
      key={field.id}
      placeholderTextColor={'#d8d8d8'}
      placeholder={field.label}
      underlineColorAndroid="transparent"
      style={{
        backgroundColor: '#F5F5F5',
        borderRadius: 3,
        marginTop: 10,
        width: 260,
        paddingVertical: 15,
        paddingHorizontal: 20,
        fontSize: 20,
      }}
      {...props}
    />
    {error && (
      <Text style={{ fontSize: 15, color: 'red', marginTop: 5 }}>{error}</Text>
    )}
  </View>
);

const FormFieldWithScrollIntoView = ({
  submitCount,
  ...props
}: React.ComponentProps<typeof FormField> & { submitCount: number }) => (
  <ScrollIntoView enabled={!!props.error} scrollIntoViewKey={submitCount}>
    <FormField {...props} />
  </ScrollIntoView>
);

class FormikScreen extends React.Component {
  static navigationOptions = {
    title: 'Formik',
  };

  render() {
    return (
      <KeyboardAvoidingView
        style={{ flex: 1, width: '100%' }}
        behavior="padding"
      >
        <ScrollIntoViewScrollView
          style={{ flex: 1, width: '100%' }}
          contentContainerStyle={{
            backgroundColor: 'white',
            alignItems: 'center',
            padding: 20,
          }}
        >
          <Formik
            validationSchema={ValidationSchema}
            initialValues={FieldInitialValues}
            onSubmit={() => Alert.alert('submit success')}
          >
            {({
              handleChange,
              handleBlur,
              submitForm,
              values,
              touched,
              errors,
              submitCount,
            }) => (
              <View>
                {Fields.map((field, i) => (
                  <FormFieldWithScrollIntoView
                    style={{ marginTop: i > 0 ? 50 : 0 }}
                    key={field.id}
                    field={field}
                    value={values[field.id]}
                    onChangeText={handleChange(field.id)}
                    onBlur={handleBlur(field.id)}
                    error={touched[field.id] ? errors[field.id] : undefined}
                    submitCount={submitCount}
                  />
                ))}
                <Centered>
                  <Button
                    style={{ marginTop: 100, marginBottom: 100 }}
                    onPress={submitForm}
                  >
                    Submit form
                  </Button>
                </Centered>
              </View>
            )}
          </Formik>
        </ScrollIntoViewScrollView>
      </KeyboardAvoidingView>
    );
  }
}

export default FormikScreen;
