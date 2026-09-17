/**
 * AddTaskModal Component
 * 
 * Full-screen modal for creating new tasks or editing existing ones.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Task, Priority, Category, CreateTaskPayload } from '../types';
import { validateTaskTitle, validateTaskDescription, validateDeadlineAfterStart } from '../utils/validators';
import { parseSafeDate } from '../utils/dateUtils'; // <-- IMPORTED SAFE PARSER
import {
  COLORS,
  SPACING,
  FONT_SIZES,
  BORDER_RADIUS,
  SHADOWS,
  FONT_WEIGHTS,
} from '../theme';

interface AddTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (taskData: CreateTaskPayload) => Promise<void>;
  editTask?: Task | null;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({
  visible,
  onClose,
  onSave,
  editTask,
}) => {
  // Determine if we're in edit mode
  const isEditMode = !!editTask;

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dateTime, setDateTime] = useState(new Date());
  const [deadline, setDeadline] = useState(new Date(Date.now() + 24 * 60 * 60 * 1000));
  const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);
  const [category, setCategory] = useState<Category>(Category.PERSONAL);

  // DateTime picker state
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [showDeadlinePicker, setShowDeadlinePicker] = useState(false);
  const [dateTimeMode, setDateTimeMode] = useState<'date' | 'time'>('date');

  // Validation errors
  const [titleError, setTitleError] = useState<string | null>(null);
  const [descriptionError, setDescriptionError] = useState<string | null>(null);
  const [deadlineError, setDeadlineError] = useState<string | null>(null);

  // Loading state
  const [saving, setSaving] = useState(false);

  /**
   * Initialize form with edit task data
   */
  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title);
      setDescription(editTask.description || '');
      // UPDATED: Use safe date parsing so old tasks don't crash the form
      setDateTime(parseSafeDate(editTask.dateTime));
      setDeadline(parseSafeDate(editTask.deadline));
      setPriority(editTask.priority);
      setCategory(editTask.category);
    } else {
      // Reset form for new task
      resetForm();
    }
  }, [editTask, visible]);

  /**
   * Reset form to default values
   */
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDateTime(new Date());
    setDeadline(new Date(Date.now() + 24 * 60 * 60 * 1000));
    setPriority(Priority.MEDIUM);
    setCategory(Category.PERSONAL);
    setTitleError(null);
    setDescriptionError(null);
    setDeadlineError(null);
  };

  /**
   * Validate form
   */
  const validateForm = (): boolean => {
    const titleValidation = validateTaskTitle(title);
    const descriptionValidation = validateTaskDescription(description);
    const deadlineValidation = validateDeadlineAfterStart(
      dateTime.toISOString(),
      deadline.toISOString()
    );

    setTitleError(titleValidation);
    setDescriptionError(descriptionValidation);
    setDeadlineError(deadlineValidation);

    return !titleValidation && !descriptionValidation && !deadlineValidation;
  };

  /**
   * Handle save button press
   */
  const handleSave = async () => {
    // Clear previous errors
    setTitleError(null);
    setDescriptionError(null);
    setDeadlineError(null);

    // Validate form
    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      const taskData: CreateTaskPayload = {
        title: title.trim(),
        description: description.trim(),
        dateTime: dateTime.toISOString(),
        deadline: deadline.toISOString(),
        priority,
        category,
        completed: isEditMode ? editTask!.completed : false,
      };

      await onSave(taskData);
      setSaving(false);
      resetForm();
      onClose();
    } catch (error: any) {
      setSaving(false);
      Alert.alert('Error', error.message || 'Failed to save task');
    }
  };

  /**
   * Handle close button press
   */
  const handleClose = () => {
    if (!saving) {
      resetForm();
      onClose();
    }
  };

  /**
   * Handle DateTime picker change
   */
  const handleDateTimeChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDateTimePicker(false);
    }

    if (event.type === 'set' && selectedDate) {
      setDateTime(selectedDate);

      if (Platform.OS === 'android' && dateTimeMode === 'date') {
        setDateTimeMode('time');
        setTimeout(() => setShowDateTimePicker(true), 100);
      } else {
        setDateTimeMode('date');
      }
    }
  };

  /**
   * Handle Deadline picker change
   */
  const handleDeadlineChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDeadlinePicker(false);
    }

    if (event.type === 'set' && selectedDate) {
      setDeadline(selectedDate);

      if (Platform.OS === 'android' && dateTimeMode === 'date') {
        setDateTimeMode('time');
        setTimeout(() => setShowDeadlinePicker(true), 100);
      } else {
        setDateTimeMode('date');
      }
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="formSheet"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} disabled={saving}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isEditMode ? 'Edit Task' : 'New Task'}
          </Text>
          <TouchableOpacity onPress={handleSave} disabled={saving}>
            <Text style={[styles.saveButton, saving && styles.saveButtonDisabled]}>
              {saving ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
          <View style={styles.form}>
            {/* Title Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Title *</Text>
              <TextInput
                style={[styles.input, titleError && styles.inputError]}
                placeholder="Enter task title"
                placeholderTextColor={COLORS.textTertiary}
                value={title}
                onChangeText={(text) => {
                  setTitle(text);
                  setTitleError(null);
                }}
                maxLength={100}
                editable={!saving}
              />
              {titleError && <Text style={styles.errorText}>{titleError}</Text>}
            </View>

            {/* Description Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea, descriptionError && styles.inputError]}
                placeholder="Enter task description (optional)"
                placeholderTextColor={COLORS.textTertiary}
                value={description}
                onChangeText={(text) => {
                  setDescription(text);
                  setDescriptionError(null);
                }}
                maxLength={500}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                editable={!saving}
              />
              {descriptionError && <Text style={styles.errorText}>{descriptionError}</Text>}
            </View>

            {/* Start Date/Time */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Start Date & Time *</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => {
                  setDateTimeMode('date');
                  setShowDateTimePicker(true);
                }}
                disabled={saving}
              >
                <Text style={styles.dateButtonText}>
                  {dateTime.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Deadline */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Deadline *</Text>
              <TouchableOpacity
                style={[styles.dateButton, deadlineError && styles.inputError]}
                onPress={() => {
                  setDateTimeMode('date');
                  setShowDeadlinePicker(true);
                }}
                disabled={saving}
              >
                <Text style={styles.dateButtonText}>
                  {deadline.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </Text>
              </TouchableOpacity>
              {deadlineError && <Text style={styles.errorText}>{deadlineError}</Text>}
            </View>

            {/* Priority Selector */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Priority *</Text>
              <View style={styles.optionsRow}>
                {[Priority.LOW, Priority.MEDIUM, Priority.HIGH].map((p) => (
                  <TouchableOpacity
                    key={p}
                    style={[
                      styles.optionButton,
                      priority === p && styles.optionButtonActive,
                    ]}
                    onPress={() => setPriority(p)}
                    disabled={saving}
                  >
                    <Text
                      style={[
                        styles.optionButtonText,
                        priority === p && styles.optionButtonTextActive,
                      ]}
                    >
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Category Selector */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category *</Text>
              <View style={styles.optionsRow}>
                {[Category.WORK, Category.PERSONAL, Category.STUDY, Category.OTHER].map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={[
                      styles.optionButton,
                      category === c && styles.optionButtonActive,
                    ]}
                    onPress={() => setCategory(c)}
                    disabled={saving}
                  >
                    <Text
                      style={[
                        styles.optionButtonText,
                        category === c && styles.optionButtonTextActive,
                      ]}
                    >
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>

        {/* DateTime Pickers */}
        {showDateTimePicker && (
          <DateTimePicker
            value={dateTime}
            mode={dateTimeMode}
            is24Hour={false}
            onChange={handleDateTimeChange}
          />
        )}
        {showDeadlinePicker && (
          <DateTimePicker
            value={deadline}
            mode={dateTimeMode}
            is24Hour={false}
            onChange={handleDeadlineChange}
          />
        )}
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
  },
  cancelButton: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  saveButton: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.primary,
  },
  saveButtonDisabled: {
    color: COLORS.disabled,
  },
  scrollView: {
    flex: 1,
  },
  form: {
    padding: SPACING.lg,
  },
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  textArea: {
    minHeight: 100,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.error,
    marginTop: SPACING.xs,
  },
  dateButton: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
  },
  dateButtonText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    fontWeight: FONT_WEIGHTS.medium,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  optionButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  optionButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  optionButtonText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.text,
  },
  optionButtonTextActive: {
    color: '#fff',
  },
});

export default AddTaskModal;