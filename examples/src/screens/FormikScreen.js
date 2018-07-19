import React from 'react';
import { Text, View, TextInput, KeyboardAvoidingView } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { ScrollIntoView } from 'react-native-scroll-into-view';
import {
  Button,
  Centered,
  ScrollIntoViewScrollView,
} from 'components/Components';
import { range, mapValues, keyBy } from 'lodash';

// We generate some random form fields
const Fields = range(0, 15).map(i => {
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

const FormField = ({ style, field, value, error, onChangeText, onBlur }) => (
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
      onChangeText={onChangeText}
      onBlur={onBlur}
      value={value}
    />
    {error && (
      <Text style={{ fontSize: 15, color: 'red', marginTop: 5 }}>{error}</Text>
    )}
  </View>
);

const FormFieldWithScrollIntoView = ({ submitCount, ...props }) => (
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
            onSubmit={() => alert('submit success')}
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
