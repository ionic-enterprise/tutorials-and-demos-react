import {
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonTitle,
  IonToggle,
  IonToolbar,
} from '@ionic/react';
import './TeaEditorPage.css';
import { close } from 'ionicons/icons';
import { Tea } from '../../models/Tea';
import { useEffect, useState } from 'react';

interface TeaEditorProps {
  tea: Tea | undefined;
  teaCategories: Tea[];
  saveTea: (tea: Tea) => void;
  onDismiss: () => void;
}

const TeaEditorPage: React.FC<TeaEditorProps> = ({ tea, teaCategories, onDismiss, saveTea }) => {
  const [teaCategory, setTeaCategory] = useState<Tea | undefined>(undefined);
  const [name, setName] = useState<string>('');
  const [brand, setBrand] = useState<string>('');
  const [type, setType] = useState<number>(0);
  const [rating, setRaiting] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');
  const [newTea, setNewTea] = useState<boolean>(false);

  useEffect(() => {
    setInitialValues();
  }, []);

  const setInitialValues = () => {
    if (tea !== undefined) {
      setName(tea.name);
      setBrand(tea.brand);
      setType(tea.teaCategoryId);
      setRaiting(tea.rating);
      setNotes(tea.notes);
      findCategory();
    } else setNewTea(true);
  };

  const findCategory = () => {
    const index = teaCategories.findIndex((t) => t.id == tea?.teaCategoryId);
    if (index !== -1) {
      const cat = teaCategories[index];
      setTeaCategory(cat);
    }
  };

  const submit = async () => {
    const updatedTea: Tea = {
      brand: brand,
      name: name,
      rating: rating,
      teaCategoryId: type,
      notes: notes,
    };
    if (tea !== undefined) {
      updatedTea.id = tea.id;
      updatedTea.description = tea.description;
      updatedTea.image = tea.image;
    }
    await saveTea(updatedTea);
    onDismiss();
  };

  const updateCategory = async (value: any) => {
    const index = teaCategories.findIndex((t) => t.id === value);
    if (index !== -1) {
      const cat = teaCategories[index];
      setTeaCategory(cat);
      setType(value);
    }
  };

  const checkDisabled = () => {
    if (name == '' || brand == '' || type == 0) return true;
    else return false;
  };

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{name}</IonTitle>
          <IonButtons slot="primary">
            <IonButton onClick={() => onDismiss()}>
              <IonIcon slot="icon-only" icon={close}></IonIcon>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonList>
          <IonItem>
            <IonLabel position="floating">Brand</IonLabel>
            <IonInput
              value={brand}
              className="brand"
              onIonChange={(e) => setBrand(e.detail.value!)}
              required
            ></IonInput>
          </IonItem>

          <IonItem>
            <IonLabel position="floating">Name</IonLabel>
            <IonInput value={name} className="name" onIonChange={(e) => setName(e.detail.value!)} required></IonInput>
          </IonItem>

          <IonItem>
            <IonSelect
              label="Type"
              name="teaCategoryId"
              value={teaCategory?.id}
              onIonChange={(e) => updateCategory(e.detail.value)}
            >
              {teaCategories.map((cat) => {
                return (
                  <IonSelectOption key={cat.id} value={cat.id}>
                    {cat.name}
                  </IonSelectOption>
                );
              })}
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonLabel position="floating">Rating</IonLabel>
            <IonInput
              value={rating}
              className="brand"
              required
              onIonChange={(e) => setRaiting(parseInt(e.detail.value!))}
            ></IonInput>
          </IonItem>

          <IonItem>
            <IonTextarea
              value={notes}
              className="brand"
              required
              label="Notes"
              labelPlacement="floating"
              name="notes"
              onIonInput={(e) => {
                setNotes(e.detail.value!);
              }}
            ></IonTextarea>
          </IonItem>
        </IonList>
      </IonContent>

      <IonFooter>
        <IonToolbar>
          <IonButton disabled={checkDisabled()} expand="full" onClick={submit}>
            {!newTea ? 'Update' : 'Add'}
          </IonButton>
        </IonToolbar>
      </IonFooter>
    </>
  );
};

export default TeaEditorPage;
